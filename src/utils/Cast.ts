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
// type CastTypeInfer<T> = T extends keyof NodeJS.ShuviProcessEnv ? NodeJS.ProcessEnv[T] : CastType
type InferValue<T> = T extends CastType
  ? {
      string: ReturnType<typeof toString>
      number: ReturnType<typeof toNumber>
      boolean: ReturnType<typeof toBoolean>
      object: ReturnType<typeof toObject>
    }[T]
  : T extends keyof NodeJS.ShuviProcessEnv
  ? NodeJS.ProcessEnv[T]
  : never

/* type CastTypeInferer<T> = T extends keyof NodeJS.ShuviProcessEnv
  ? NodeJS.ShuviProcessEnv[T] extends PrimitiveType<CastType>
    ? PrimitiveType<typeof InternalEnv>
    : CastType
  : CastType */

export function cast<S extends string, T extends CastType, P extends InferValue<T>>(
  key: S,
  type: T,
  defaultValue?: P
): P
export function cast<
  K extends keyof NodeJS.ShuviProcessEnv,
  T extends CastType,
  P extends InferValue<K>
>(key: K, type: T, defaultValue?: P): P {
  const value = process.env[key] as string

  if (value === undefined)
    if (!defaultValue) throw new Error(`Expected ${key} but not found. Pass it into ".env" file!`)
    else return defaultValue
  else return typeConverter[type](value) as P
}
