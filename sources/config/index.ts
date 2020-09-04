import { config, DotenvParseOutput } from 'dotenv'

export class Config {
  public static async loadFromFile(path: string): Promise<DotenvParseOutput | NodeJS.ProcessEnv> {
    try {
      const env = config({ path, encoding: 'utf-8' })

      if (env.error) throw env.error

      this.parsed = Object.assign({}, this.parsed, env.parsed!)
      return Promise.resolve(env.parsed!)
    } catch (e) {
      return Promise.reject(process.env)
    }
  }

  public static set parsed(env: NodeJS.ProcessEnv) {
    this.parsed = env
  }

  public static get parsed(): NodeJS.ProcessEnv {
    return this.parsed
  }

  public static applyToProcess(): Promise<NodeJS.ProcessEnv> {
    return new Promise((resolve, reject) => {
      try {
        process.env = { ...process.env, ...this.parsed }

        resolve(process.env)
      } catch {
        reject()
      }
    })
  }

  public static applyTo(fn: (...args: unknown[]) => unknown): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        fn(this.parsed)
        resolve(true)
      } catch {
        reject(false)
      }
    })
  }

  public static clear(): void {
    this.parsed = {}
  }
}
