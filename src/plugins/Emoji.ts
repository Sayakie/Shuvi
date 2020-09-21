import { Constants, MessageEmbed } from 'discord.js'
import { EVENT, PATTERN } from '../helpers/Constants'
import type { ModuleOptions } from '../types'

export default ({ client }: ModuleOptions): void => {
  client.incrementMaxListener()
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  client.on(EVENT.MESSAGE_CREATE, async message => {
    if (!message.guild) return
    if (client.settings.get(message.guild.id, 'ignoreBot') && message.author.bot) return

    const emojiMatch = PATTERN.EMOJI.exec(message.cleanContent)

    if (emojiMatch) {
      // eslint-disable-next-line new-cap
      const emoji = Constants.Endpoints.CDN(client.options.http!.cdn!).Emoji(
        emojiMatch.groups!['id'],
        emojiMatch.groups!['animation'] ? 'gif' : 'png'
      )

      const color = message.member!.displayColor
      const name = message.member!.displayName
      const embed = new MessageEmbed()
        .setAuthor(name, message.author.avatarURL({ dynamic: true })!)
        .setImage(emoji)
        .setColor(color)

      await message.channel.send(embed)
      if (message.deletable) {
        await message.delete()
      }
    }
  })
}
