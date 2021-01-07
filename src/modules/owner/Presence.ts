import { SYMBOL } from '../../helpers/Constants'
import { Category } from '../../structs/Category'
import { Module } from '../../structs/Module'
import type { ModuleOptions } from '../../types'

export class Presence extends Module {
  public name: string

  constructor({ client }: ModuleOptions) {
    super({ client })

    this.name = 'Presence'
    this.aliases = ['setpresence', 'setstatus']
    this.description = ''
    this.category = Category.Owner
    this.ownerOnly()
    this.hide()
  }

  async run(): Promise<void> {
    const activity = this.args.join(SYMBOL.WHITESPACE)

    await this.client.user!.setActivity({
      name: activity
    })
  }
}

export default Presence
