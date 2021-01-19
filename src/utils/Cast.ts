import { SYMBOL } from '../shared/Constants'

const toNumber = (value: string): number => {
  const result = Number(value)

  if (
    !(
      Number.isNaN(result) ||
      result >= Number.MAX_SAFE_INTEGER ||
      result <= Number.MIN_SAFE_INTEGER
    )
  ) {
    return result
  }

  return 0
}

const toBoolean = (value: string): boolean => {
  const truthies = ['true']

  if (truthies.includes(toString(value).toLowerCase())) {
    return true
  }

  return false
}

const toString = (value: string): string => value

const toObject = (value: string): (string | number | boolean)[] =>
  value
    .trim()
    .replace(/\[|\]|\s+/g, SYMBOL.NOT_EXISTS)
    .split(',')
    .filter(Boolean)

const typeConverter = {
  number: toNumber,
  string: toString,
  boolean: toBoolean,
  object: toObject
}

type CastType = 'string' | 'number' | 'boolean' | 'object'
type PrimitiveType<T> = T extends CastType
  ? {
      string: ReturnType<typeof toString>
      number: ReturnType<typeof toNumber>
      boolean: ReturnType<typeof toBoolean>
      object: ReturnType<typeof toObject>
    }[T]
  : never

export const cast = <
  K extends keyof NodeJS.ProcessEnv,
  T extends CastType,
  P extends PrimitiveType<T>
>(
  key: K,
  type: T,
  defaultValue?: P
): P => {
  const value = process.env[key] as string

  if (value === undefined)
    if (!defaultValue)
      throw new Error(
        `Expected ${key} but not found. Pass [Key {${key}}] into .env file or type "cross-env ${key}=value" in cli.`
      )
    else return defaultValue
  else return typeConverter[type](value) as P
}
