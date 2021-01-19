/**
 * Thrown when they tries to initialise client that requires shard info to be provided.
 */
export class ShardIsNotSetupError extends Error {
  constructor() {
    super()

    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    this.message = '"shard" is not set. Spawn with bootstrap/ShardManager#spawn().'
  }
}
