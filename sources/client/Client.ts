import { Client as DiscordClient, Collection } from 'discord.js'
import type { Module } from '../structures/Module'
import type { ClientOptions } from 'discord.js'

export class Client extends DiscordClient {
  #modules: Collection<string, Module>
  #aliases: Map<string, Module>

  constructor(options?: ClientOptions) {
    super(options)

    this.#modules = new Collection<string, Module>()
    this.#aliases = new Map<string, Module>()
  }

  public get modules(): Collection<string, Module> {
    return this.#modules
  }

  public get aliases(): Map<string, Module> {
    return this.#aliases
  }
}
