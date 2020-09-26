import { Category } from '../../structs/Category'
import { Module } from '../../structs/Module'
import type { GuildOptions, ModuleOptions } from '../../types'

export class Prefix extends Module {
  public name: string

  constructor({ client }: ModuleOptions) {
    super({ client })

    this.name = 'Prefix'
    this.aliases = ['setprefix', 'sp']
    this.description = 'Set prefix of this guild.'
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

    const prevPrefix = (settings.get(
      guild!.id,
      'commandPrefix'
    ) as unknown) as GuildOptions['commandPrefix']
    if (denyPrefix) {
      await message.reply('prefixes with spaces are not allowed!')
      return
    }

    if (prevPrefix === newPrefix) {
      await channel.send('reset up completed')
      settings.delete(guild!.id)
      return
    }

    if (newPrefix.length >= 3) {
      await channel.send('No prefixes more than 3 characters!')
      return
    }

    settings.setProp(guild!.id, 'commandPrefix', newPrefix)
    await channel.send(`prefix is changed to ${newPrefix} successfully.`)
  }
}

export default Prefix
