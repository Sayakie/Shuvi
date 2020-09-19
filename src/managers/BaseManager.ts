import { BaseClient, Util } from 'discord.js'

export abstract class BaseManager extends BaseClient {
  toString(): string {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `${this.constructor.name} {${Util.flatten(this)}}`
  }
}
