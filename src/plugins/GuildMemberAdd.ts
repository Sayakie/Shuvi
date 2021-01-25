/* eslint-disable @typescript-eslint/no-misused-promises */
import { plugin as debug } from '../helpers/debugger'
import { EVENT } from '../shared/Constants'
import { MessageEmbed } from 'discord.js'
import type { PluginGateway } from '../structs/Plugin'
import type { GuildMember } from 'discord.js'

export default (Plugin => {
  const { client } = Plugin

  const guildMemberAddHandler = async (member: GuildMember) => {
    const { guild, user } = member
    const { welcomeMessage, welcomeRole } = await client.loadGuildSettings(guild)
    debug(`${user.tag} joined to <Guild ${guild.name}(${guild.id})>`)

    if (welcomeMessage) {
      debug(`<Guild ${guild.name}(${guild.id})> had set up welcome message.`)

      const { type, channelId, content } = welcomeMessage

      const message = typeof content === 'string' ? content : new MessageEmbed(content)
      if (type === 'dm') {
        debug(`Type is DM`)

        member.send(message)
      } else if (type === 'specified_channel') {
        debug(`Type is Specified_channel`)

        const channel = guild.channels.resolve(channelId!)!
        channel.isText() && channel.send(message)
      }
    } else {
      debug(`No welcome message found for <Guild ${guild.name}(${guild.id})`)
    }

    if (welcomeRole) {
      debug(`<Guild ${guild.name}(${guild.id}) had set up welcome role.`)

      const { timing, roleId } = welcomeRole
      switch (timing) {
        case 'always':
          await member.roles.add(roleId!, 'automatically gives on join')
          break
        case 'react':
        case 'captcha':
          // TODO
          break
        default:
          debug('But "timing" did not match. void()')
      }
    }
  }

  client.incrementMaxListener()
  client.on(EVENT.GUILD_MEMBER_ADD, guildMemberAddHandler)

  return () => {
    client.decrementMaxListener()
    client.off(EVENT.GUILD_MEMBER_ADD, guildMemberAddHandler)
  }
}) as PluginGateway
