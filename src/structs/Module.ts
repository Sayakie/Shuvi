import { Category } from './Category'
import { cast } from '../utils'
import { MessageEmbed } from 'discord.js'
import type { Message, PermissionString } from 'discord.js'
import type { Client } from '../App'

const dummyModule = {
  run(): void {
    /** do nothing */
  }
}

export type ModuleOptions = {
  client: Client
  name?: string
}

export abstract class Module {
  public name: string
  public aliases: string[] = []
  public description = 'No description provided.'
  public details = 'No details provided.'
  public usage = 'No usage provided.'
  public category: Category = Category.Uncategorized
  public botPermissions: PermissionString[] = []
  public userPermissions: PermissionString[] = []

  protected client: Client
  protected message!: Message
  protected args!: string[]

  #guildOnly = false
  #ownerOnly = false
  #nsfwOnly = false
  #hidden = false

  protected constructor(options: ModuleOptions) {
    const { client } = options

    this.client = client
    this.name = this.constructor.name
  }

  get isGuildOnly(): boolean {
    return this.#guildOnly
  }

  get isOwnerOnly(): boolean {
    return this.#ownerOnly
  }

  get isNsfwOnly(): boolean {
    return this.#nsfwOnly
  }

  get isHidden(): boolean {
    return this.#hidden
  }

  protected guildOnly(): void {
    this.#guildOnly = true
  }

  protected ownerOnly(): void {
    if (this.category !== Category.Owner) {
      console.warn(`${this.toString()} called #ownerOnly but that category does not match.`)
    }

    this.#ownerOnly = true
  }

  protected nsfwOnly(): void {
    this.#nsfwOnly = true
  }

  protected hide(): void {
    this.#hidden = true
  }

  inject(message: Message, args: string[]): this {
    this.message = message
    this.args = args

    // Validate compare of the module
    // that is owner only from another match.
    if (this.isOwnerOnly || this.category === Category.Owner) {
      if (
        !cast('OWNERS', 'object', ['']).join('247351691077222401').includes(this.message.author.id)
      )
        return dummyModule as this
    }

    if (this.isGuildOnly && !this.message.guild) {
      const Embed = new MessageEmbed()
        .setColor('#0099cc')
        .setTitle(':loudspeaker: Unavailable on this channel!')
        .setDescription(
          'This function provided for only `Guild` (alias as server)! DM do not allowed to use.'
        )

      this.message.channel.send(Embed)
      return dummyModule as this
    }

    return this
  }

  run(): void | Promise<void> {
    throw new Error(`${this.toString()} did not set up a run() method.`)
  }

  cleanup(): void | Promise<void> {
    /** o_O */
  }

  toStirng(): string {
    return `Module {${this.constructor.name}}`
  }
}
