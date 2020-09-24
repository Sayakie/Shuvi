import { EVENT } from '../helpers/Constants'
import type { ModuleOptions } from '../types'

export default ({ client }: ModuleOptions): void => {
  client.incrementMaxListener()
  client.on(EVENT.MESSAGE_CREATE, message => {
    if (!message.guild) return
    if (message.guild.id === '714403904682721314') return
    console.log(`${message.author.tag} > ${message.cleanContent}`)
  })
}
