import { EVENT, PATTERN } from '../../helpers/Constants'
import type { GuildMember, PartialGuildMember } from 'discord.js'
import type { ModuleOptions } from '../../types'

const GuildID = '471737560524390420'
const Trainer = '트레이너'

export const setUnvalidNickname = (member: GuildMember | PartialGuildMember): void => {
  if (member.guild.id !== GuildID) return
  if (member.partial) {
    member.fetch().then(setUnvalidNickname).catch(console.error)
    return
  }

  const nickname = member.nickname || member.displayName || member.user.username
  if (PATTERN.ENGLISH_ONLY.exec(nickname) !== null) return
  if (member.roles.cache.size > 0 && member.roles.highest.name !== Trainer) return

  member.setNickname('Unnamed_Trainer', 'Unvalid nickname did not allowed in Izuna Online.')
}

export default ({ client }: ModuleOptions): void => {
  client.incrementMaxListener()
  client.on(EVENT.GUILD_MEMBER_ADD, member => {
    // setUnvalidNickname(member)
    console.log(member)
  })
  client.on(EVENT.GUILD_MEMBER_UPDATE, (_, member) => {
    // setUnvalidNickname(member)
    if (member.user?.bot) return
    console.log(member)
  })
}
