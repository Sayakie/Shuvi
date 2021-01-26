import { Category } from '../../structs/Category'
import { Module } from '../../structs/Module'
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
      client,
      message,
      message: { guild, channel }
    } = this
    const { [0]: newPrefix, [1]: denyPrefix } = this.args

    if (denyPrefix) {
      await message.reply('prefix with spaces are not allowed!').then(async (msg) => {
        await new Promise((resolve) => {
          setTimeout(() => {
            void message.delete()
            void msg.delete()
            resolve(void 0)
          }, 5000)
        })
      })

      return
    } else if (newPrefix.length >= 3) {
      await channel.send('No prefix more than 3 characters!').then(async (msg) => {
        await new Promise((resolve) => {
          setTimeout(() => {
            void message.delete()
            void msg.delete()
            resolve(void 0)
          }, 5000)
        })
      })

      return
    }

    const guildSettings = await client.loadGuildSettings(guild!)
    guildSettings.invoke = newPrefix
    const stringified = JSON.stringify(guildSettings)

    await client.dataManager.guilds.put(guild!.id, stringified)
    await message.reply(`Set prefix to \`${newPrefix}\`!`)
  }
}

export default Prefix
