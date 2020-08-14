import * as dotEnv from 'dotenv'

class Util {
  private constructor() {
    throw new Error()
  }

  static parseConfig(): void {
    dotEnv
  }
}

export { Util }
