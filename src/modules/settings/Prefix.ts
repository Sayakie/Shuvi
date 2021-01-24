import { Category } from '../../structs/Category'
import { Module } from '../../structs/Module'
import type { DataSet } from '../../structs/DataSet'
import type { ModuleOptions } from '../../structs/Module'

export class Prefix extends Module {
  constructor(options: ModuleOptions) {
    super(options)

    this.aliases = ['setprefix', 'sp']
    this.description = 'Set prefix of each guild.'
    this.category = Category.Settings
    this.userPermissions = ['MANAGE_GUILD']
    this.guildOnly()
  }

  async run(): Promise<void> {
    const {
      client: { settings },
      message,
      message: { guild, channel }
    } = this
    const { [0]: newPrefix, [1]: denyPrefix } = this.args

    if (denyPrefix) {
      await message.reply('prefix witch spaces are not allowed!').then(async msg => {
        await message.delete()
        await msg.delete()
      })

      return
    } else if (newPrefix.length >= 3) {
      await channel.send('No prefix more than 3 characters!').then(async msg => {
        await message.delete()
        await msg.delete()
      })

      return
    }

    const guildSettings = this.client.dataManager.find(this.message.guild!.id) as DataSet<string>
    guildSettings.get('')
  }
}

export default Prefix
