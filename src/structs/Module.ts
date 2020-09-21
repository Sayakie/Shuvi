import { Category } from './Category'
import type { Message, PermissionString } from 'discord.js'
import type { Client } from '../Client'
import type { ModuleOptions } from '../types'
import { cast } from '../utils'

type NullableString = string | undefined

const dummyModule = {
  run(): void {
    /** do nothing */
  }
}

export abstract class Module {
  readonly active: boolean = false
  abstract name = Module.toString()
  aliases: string[] = []
  description: NullableString = 'No description provided.'
  details: NullableString = 'No details provided.'
  usage: NullableString = 'No usage provided.'
  category: Category = Category.Uncategorized
  botPermissions: PermissionString[] = []
  userPermissions: PermissionString[] = []

  protected client: Client
  protected message!: Message
  protected args!: string[]

  #guildOnly = false
  #ownerOnly = false
  #nsfwOnly = false
  #hidden = false

  protected constructor({ client }: ModuleOptions) {
    this.active = true
    this.client = client
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

  inject(message: Message, args: string[]): this | typeof dummyModule {
    this.message = message
    this.args = args

    // Validate compare of the module that is owner only from author match.
    if (this.isOwnerOnly || this.category === Category.Owner) {
      if (!cast('OWNERS', 'object', ['']).includes(this.message.author.tag)) return dummyModule
    }

    if (this.message.guild) {
      if (!this.message.member!.hasPermission(this.userPermissions)) {
        this.message.channel.send('권한 없음!')
        return dummyModule
      }

      if (!this.message.guild.me!.hasPermission(this.botPermissions)) {
        this.message.channel.send('나 권한 없음!')
        return dummyModule
      }

      // @ts-ignore
      if (!this.message.channel.nsfw && this.isNsfwOnly) return dummyModule
    }

    return this
  }

  run<T>(): T | Promise<T> | Promise<void> {
    throw new Error(`${this.toString()} did not set up a run() method.`)
  }

  detach(): void {
    this.client.decrementMaxListener()
  }

  toString(): string {
    return `Module {${this.constructor.name}}`
  }
}
