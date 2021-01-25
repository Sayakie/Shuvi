import { SYMBOL } from '../../shared/Constants'
import { Category } from '../../structs/Category'
import { Module } from '../../structs/Module'
import type { ModuleOptions } from '../../structs/Module'

export class Presence extends Module {
  constructor(options: ModuleOptions) {
    super(options)

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
