import { load } from 'dotenv-extended'
import { default as mustache } from 'dotenv-mustache'
import { default as parseVariables } from 'dotenv-parse-variables'
import { NoInstantClassError } from '../errors/NoInstantClassError'
import { CouldNotParseEnvFileError } from '../errors/CouldNotParseEnvFileError'
import { $root } from '../shared/Path'
import type { DotenvParseOutput } from 'dotenv/types'

export class Config {
  private constructor() {
    throw new NoInstantClassError(this.constructor.name)
  }

  /**
   * Parse an `.env` file contents from path,
   * return an object that composed key/value key-pair
   * and update into {@link https://nodejs.org/api/process.html#process_process_env|environment constants (process.env)} silencly,
   * throws if the path is not exists or can not readable.
   *
   * @param {string} [path]
   * @return {Promise<DotenvParseOutput>}
   */
  static async parse(path = `${$root}/.env`): Promise<DotenvParseOutput> {
    return new Promise((resolve, reject) => {
      try {
        let env = load({
          path,
          encoding: 'utf-8',
          silent: process.env.NODE_ENV === 'production',
          errorOnMissing: true
        }) as DotenvParseOutput & Partial<NodeJS.ProcessEnv>
        env = mustache(env)
        env = parseVariables(env)

        process.env = { ...process.env, ...env }
        resolve(env)
      } catch (err) {
        reject(new CouldNotParseEnvFileError(err))
      }
    })
  }
}
