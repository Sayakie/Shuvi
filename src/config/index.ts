import * as dotEnv from 'dotenv'

class Config {
  private static parsed: NodeJS.ProcessEnv = {}
  public static loadFromFile(path: string): NodeJS.ProcessEnv {
    try {
      const env = dotEnv.config({ path, encoding: 'utf-8' })

      if (env.error) throw env.error

      Config.parsed = Object.assign({}, Config.parsed, env.parsed!)
      return env.parsed!
    } catch (e) {
      return process.env
    }
  }

  public static applyToProcess(): void {
    process.env = { ...process.env, ...Config.parsed }
    Config.parsed = {}
  }
}

export { Config }
