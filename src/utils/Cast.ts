/** @see {@link https://velog.io/@public_danuel/process-env-on-node-js|Node.js 기반에서 환경변수 사용하기} */

import type { ProcessEnvProperty } from '../types'

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

const toObject = (value: string): string[] => value.trim().split(',')

const typeConverter = {
  number: toNumber,
  string: toString,
  boolean: toBoolean,
  object: toObject
}

type CastType = 'string' | 'number' | 'boolean' | 'object'
type PrimitiveType<T> = T extends CastType
  ? { string: string; number: number; boolean: boolean; object: string[] }[T]
  : never

export const cast = <
  P extends PrimitiveType<T>,
  K extends keyof ProcessEnvProperty,
  T extends CastType
>(
  key: K | string,
  type: T,
  defaultValue?: P
): P => {
  const value = process.env[key]!

  if (value === undefined)
    if (!defaultValue)
      throw new Error(
        `Expected ${key} but not found. Pass [Key {${key}}] into .env file or type "cross-env ${key}=value" in cli.`
      )
    else return defaultValue
  else return typeConverter[type](value) as P
}
