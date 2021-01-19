import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

export const getFilename = (url: string): string => fileURLToPath(url)
export const getDirname = (url: string): string => dirname(getFilename(url))

export const $main = resolve(getDirname(import.meta.url), '../')
export const $root = resolve($main, '../')
