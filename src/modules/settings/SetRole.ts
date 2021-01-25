import { Category } from '../../structs/Category'
import { Module } from '../../structs/Module'
import type { ModuleOptions } from '../../structs/Module'

export class SetRole extends Module {
  constructor(options: ModuleOptions) {
    super(options)

    this.aliases = ['역할설정']
    this.description = 'Set role'
    this.category = Category.Settings
    this.botPermissions = ['MANAGE_ROLES']
    this.userPermissions = ['MANAGE_GUILD']
    this.guildOnly()
  }

  async run(): Promise<void> {
    const {
      client,
      message,
      message: { guild }
    } = this
    const { [0]: roleId } = this.args

    const role = guild!.roles.resolve(roleId)
    if (!role) {
      await this.message.reply('mentioned role does not exist!').then(msg => {
        setTimeout(() => {
          message.delete()
          msg.delete()
        }, 5000)
      })

      return
    }

    const guildSettings = await client.loadGuildSettings(guild!)
    guildSettings.welcomeRole.roleId = role.id
    const stringified = JSON.stringify(guildSettings)

    await client.dataManager.guilds.put(guild!.id, stringified)
    await message.reply(`\`@${role.name}\`으로 설정 완료!`)
  }
}

export default SetRole
