import { Message } from 'discord.js'
import { Client } from '../client/Client'
import type { CommandOptions } from '../types'

export abstract class Command {
  protected readonly client: Client
  protected active = false

  protected message!: Message
  protected args!: string[]

  protected constructor (options: CommandOptions) {
    this.client = options.client
    this.active = true
  }

  public inject ( message: Message, ...args: string[] ): Command {
    this.message = message
    this.args = args

    return this
  }

  public run<T> (): T | Promise<T> {
    throw new Error(`[Command ${this.constructor.name}] did not set up a run() method.`)
  }
}
