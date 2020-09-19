import { Constants, MessageEmbed } from 'discord.js'
import { EVENT, PATTERN } from '../helpers/Constants'
import type { ModuleOptions } from '../types'

export default ({ client }: ModuleOptions): void => {
  client.incrementMaxListener()
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  client.on(EVENT.MESSAGE_CREATE, async message => {
    const isEmojiIncludes = PATTERN.EMOJI.exec(message.cleanContent)

    if (isEmojiIncludes) {
      // eslint-disable-next-line new-cap
      const emoji = Constants.Endpoints.CDN(client.options.http!.cdn!).Emoji(
        isEmojiIncludes.groups!['id'],
        isEmojiIncludes.groups!['animation'] ? 'gif' : 'png'
      )

      const color = message.guild ? message.member!.roles.highest.color : 39372
      const embed = new MessageEmbed()
        .setTitle(`${message.author.tag}님의 이모지`)
        .setImage(emoji)
        .setColor(color)

      await message.channel.send(embed)
      if (message.deletable) {
        await message.delete()
      }
    }
  })
}
