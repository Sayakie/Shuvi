import Error from './base'

export class CouldNotParseEnvFileError extends Error {
  constructor(message: string) {
    super()

    this.message = `Could not parse the env file!\n\n  ${message}`
  }
}
