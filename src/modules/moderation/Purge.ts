import { Category } from '../../structs/Category'
import { Module } from '../../structs/Module'
import type { ModuleOptions } from '../../types'

export class Purge extends Module {
  public name: string

  constructor({ client }: ModuleOptions) {
    super({ client })

    this.name = 'Purge'
    this.aliases = ['clear']
    this.description = ''
    this.category = Category.Moderation
    this.botPermissions = ['MANAGE_MESSAGES']
    this.userPermissions = ['MANAGE_MESSAGES']
    this.ownerOnly()
    this.hide()
  }

  async run(): Promise<void> {
    const deleteAmount = Number(this.args[0])

    if (isNaN(deleteAmount)) {
      this.message.reply('Please use a number between 1-99 (ex: !!purge 25)')
      return
    } else if (deleteAmount >= 100) {
      this.message.reply('You can only delete 99 messages at a time.')
      return
    }

    this.message.channel.type == 'text' &&
      (await this.message.channel.bulkDelete(deleteAmount + 1, true))
  }
}

export default Purge
