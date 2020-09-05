import { EventEmitter } from 'events'
import { Collection } from 'discord.js'

type envInput = string
type envOutput = unknown

export class EnvManager extends EventEmitter {
  #env: Collection<envInput, envOutput>

  constructor() {
    super()

    this.#env = new Collection()
  }
}
