import { Client as DiscordClient, Collection } from 'discord.js'
import { Command } from '../structures/Command'
import type { ClientOptions } from 'discord.js'

export class Client extends DiscordClient {
  private commands: Collection<string, Command>

  constructor(options?: ClientOptions) {
    super(options)

    this.commands = new Collection<string, Command>()
    this.fetchCommands()
    this.attachEvent()
  }

  private fetchCommands(): void {
    // TODO
  }

  private attachEvent(): void {
    // TODO
  }
}
