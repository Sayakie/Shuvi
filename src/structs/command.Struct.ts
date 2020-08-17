import { Message } from 'discord.js'
import { ShuviClient } from 'Shuvi'

abstract class Command {
  protected client!: ShuviClient
  public name!: string
  public aliases: string[]
  protected message!: Message
  protected args: string[]

  public constructor() {
    this.args = []
    this.aliases = []

    return this
  }

  public initialise(Client: ShuviClient): void {
    this.client = Client
  }

  public inject(message: Message, args: string[]): Command {
    this.message = message
    this.args = args
    return this
  }

  public run(): void | Promise<void> {
    throw new Error(`${this.constructor.name} command does not have a run() method.`)
  }
}

export { Command }
