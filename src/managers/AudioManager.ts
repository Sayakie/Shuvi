import { Collection } from 'discord.js'
import { Dispatcher } from '../structs/Dispatcher'
import type { Client } from '../App'

export type AudioManagerOptions = {
  client: Client
}

export class AudioManager {
  public client: Client
  public dispatchers: Collection<string, Dispatcher>

  constructor(options: AudioManagerOptions) {
    const { client } = options

    this.client = client
    this.dispatchers = new Collection()
  }

  public create(): void {
    const dispatcher = new Dispatcher()

    this.dispatchers.set(dispatcher.name, dispatcher)
  }
}
