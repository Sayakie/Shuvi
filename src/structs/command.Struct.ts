import { Message } from 'discord.js'
import { Application } from 'Shuvi'

abstract class Command {
  protected instance!: Application

  public abstract name: string
  public abstract aliases: string[] = []
  protected message!: Message
  protected args!: string[]
  protected description: string | undefined
  protected details: string | undefined
  protected usage: string | undefined
  protected botPermissions: string[] = []
  protected userPermissions: string[] = []
  protected _guildOnly = false
  protected _ownerOnly = false
  protected _nsfwOnly = false
  protected hidden = false

  public initialise(Instance: Application): void {
    this.instance = Instance
  }

  protected noDetails(): void {
    this.details = this.description
  }

  protected guildOnly(): void {
    this._guildOnly = !0
  }

  protected ownerOnly(): void {
    this._ownerOnly = !0
  }

  protected nsfwOnly(): void {
    this._nsfwOnly = !0
  }

  protected hide(): void {
    this.hidden = Boolean(1 << 0)
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
