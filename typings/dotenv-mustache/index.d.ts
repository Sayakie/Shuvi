declare module 'dotenv-mustache' {
  import type { DotenvParseOutput } from 'dotenv/types'

  export default function (env: DotenvParseOutput): DotenvParseOutput
}
