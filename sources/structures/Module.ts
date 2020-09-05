import { Message } from 'discord.js'
import { Category } from './Category'
import type { Client } from '../client/Client'
import type { ModuleOptions } from '../types'

export abstract class Module {
  public readonly client: Client
  public readonly active: boolean = false
  public abstract name = this.constructor.name.toLowerCase()
  public abstract aliases: string[] = []
  public abstract description: string | undefined
  public abstract details: string | undefined
  public abstract usage: string | undefined
  public abstract category: Category = Category.Uncategorized
  public abstract botPermissions: number[] = []
  public abstract userPermissions: number[] = []

  protected message!: Message
  protected args!: string[]

  #guildOnly = false
  #ownerOnly = false
  #nsfwOnly = false
  #hidden = false

  protected constructor(options: ModuleOptions) {
    this.client = options.instance.client
    this.active = true
  }

  protected guildOnly(): void {
    this.#guildOnly = true
  }

  public get isGuildOnly(): boolean {
    return this.#guildOnly
  }

  protected ownerOnly(): void {
    this.#ownerOnly = true
  }

  public get isOwnerOnly(): boolean {
    return this.#ownerOnly
  }

  protected nsfwOnly(): void {
    this.#nsfwOnly = true
  }

  public get isNsfwOnly(): boolean {
    return this.#nsfwOnly
  }

  protected hide(): void {
    this.#hidden = true
  }

  public inject(message: Message, ...args: string[]): this {
    this.message = message
    this.args = args

    return this
  }

  public run<T>(): T | Promise<T> {
    throw new Error(`${this.toString()} did not set up a run() method.`)
  }

  public toString(): string {
    return `Module {${this.constructor.name}}`
  }
}
