/* eslint-disable @typescript-eslint/no-misused-promises */
import { Client } from '../App'
import { plugin as debug } from '../helpers/debugger'
import { EVENT } from '../shared/Constants'
import type { Guild } from 'discord.js'
import type { PluginGateway } from '../structs/Plugin'

export default (Plugin => {
  const { client } = Plugin

  const guildCreateHandler = async (guild: Guild) => {
    debug(`Joined <Guild ${guild.name}(${guild.id})>`)
    const guildSettings = JSON.stringify(Client.guildSettings)

    await client.dataManager.guilds.put(guild.id, guildSettings)
  }

  const guildDeleteHandler = async (guild: Guild) => {
    debug(`Left <Guild ${guild.name}(${guild.id})>`)

    await client.dataManager.guilds.delete(guild.id)
  }

  client.incrementMaxListener(2)
  client.on(EVENT.GUILD_CREATE, guildCreateHandler)
  client.on(EVENT.GUILD_DELETE, guildDeleteHandler)

  return () => {
    client.decrementMaxListener(2)
    client.off(EVENT.GUILD_CREATE, guildCreateHandler)
    client.off(EVENT.GUILD_DELETE, guildDeleteHandler)
  }
}) as PluginGateway
