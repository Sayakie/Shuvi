declare module 'dotenv-parse-variables' {
  import type { DotenvParseOutput } from 'dotenv/types'

  export default function (env: DotenvParseOutput): DotenvParseOutput
}
