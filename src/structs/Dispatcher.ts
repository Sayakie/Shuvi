import { StreamDispatcher } from 'discord.js'
import { nanoid } from 'nanoid'
import type { VoiceConnection } from 'discord.js'

export class Dispatcher extends StreamDispatcher {
  public name: string
  public connection: VoiceConnection

  constructor() {
    this.name = nanoid(5)
    this.connection
  }
}
