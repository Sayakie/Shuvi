/* eslint-disable @typescript-eslint/no-misused-promises */
import { plugin as debug } from '../helpers/debugger'
import { EVENT } from '../shared/Constants'
import { GuildMember, MessageEmbed } from 'discord.js'
import type { PluginEntry } from '../structs/Plugin'

export default (Plugin => {
  const { client } = Plugin

  const guildMemberAddHandler = async (member: GuildMember) => {
    debug(`${member.user.tag} joined to <Guild ${member.guild.name}(${member.guild.id})>`)
    const { welcomeMessage } = await client.loadGuildSettings(member.guild)

    if (welcomeMessage) {
      debug(`<Guild ${member.guild.name}(${member.guild.id})> has set up welcome message.`)

      const { type, channelId, content } = welcomeMessage

      const message = typeof content === 'string' ? content : new MessageEmbed(content)
      if (type === 'dm') {
        debug(`Type is DM`)

        member.send(message)
      } else if (type === 'specified_channel') {
        debug(`Type is Specified_channel`)

        const channel = member.guild.channels.resolve(channelId!)!
        channel.isText() && channel.send(message)
      }
    } else {
      debug(`No welcome message found at <Guild ${member.guild.name}(${member.guild.id})`)
    }
  }

  client.incrementMaxListener()
  client.on(EVENT.GUILD_MEMBER_ADD, guildMemberAddHandler)

  return () => {
    client.decrementMaxListener()
    client.off(EVENT.GUILD_MEMBER_ADD, guildMemberAddHandler)
  }
}) as PluginEntry
