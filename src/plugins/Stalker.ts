/**
import { EVENT } from '../helpers/Constants'
import type { Message } from 'discord.js'
import type { ModuleOptions } from '../types'

export default ({ client }: ModuleOptions): void => {
  const cleanup = (message: Message): void => {
    message.channel.messages.cache.delete(message.id)
  }

  client.incrementMaxListener()
  client.on(EVENT.MESSAGE_DELETE, message => {
    // Early return if not from guild
    if (!message.guild) return

    // Fetch data if message is partial
    if (message.partial) {
      message.fetch().then()
    }
    if (!message.partial) {
      console.log(`DELETED: ${message.author.tag} deleted ${message.cleanContent}`)
    } else {
      message.fetch().then(cleanup)
    }
  })
}
*/
