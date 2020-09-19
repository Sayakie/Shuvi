import { config } from 'dotenv'
import type { DotenvConfigOutput } from 'dotenv/types'
import { $root } from '../helpers/Path'

export class Config {
  private constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`)
  }

  /**
   * Parses a .env file contents from path,
   * returns key/value object struct
   * and updates into {@link https://nodejs.org/api/process.html#process_process_env|environment constants (process.env)} silencly,
   * throws if the path is not exists or can not readable.
   *
   * @static
   * @async
   * @param {string} [path]
   * @return {Promise<DotenvConfigOutput | NodeJS.ReadOnlyDict<string>>}
   */
  static async parse(
    path = `${$root}/.env`
  ): Promise<DotenvConfigOutput | NodeJS.ReadOnlyDict<string>> {
    return new Promise((resolve, reject) => {
      const env = config({ path, encoding: 'utf-8' })

      if (env.error) reject(env.error)
      else resolve(env.parsed)
    })
  }
}
