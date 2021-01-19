import Error from './base'

export class NoInstantClassError extends Error {
  constructor(className = NoInstantClassError.name) {
    super()

    this.message = `The ${className} class may not be instantiated.`
  }
}
