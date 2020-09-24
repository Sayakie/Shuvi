/* eslint-disable camelcase */
import fetch from 'node-fetch'
import { EVENT } from '../helpers/Constants'
import { cast } from '../utils'
import type { ModuleOptions } from '../types'

// const rateLimits = new Map()

export default ({ client }: ModuleOptions): void => {
  client.incrementMaxListener()
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  client.on(EVENT.MESSAGE_CREATE, async message => {
    if (!message.guild) return
    if (message.channel.type !== 'news') return

    const {
      options: { http }
    } = client
    const { channel, guild } = message
    // await message.crosspost()

    await fetch(
      `${http!.api!}/v${http!.version!}/channels/${channel.id}/messages/${message.id}/crosspost`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bot ${cast('DISCORD_TOKEN', 'string')}`
        }
      }
    )
      .then(res => res.json())
      .then(({ code, retry_after }: { code: number; retry_after: number }) => {
        if (code) console.log(code)
        else if (retry_after) console.log(retry_after)
        else
          console.log(
            `Published ${message.id} in #${channel.name}(${channel.id}) - "${guild.name}" (${guild.id})`
          )
      })
  })
}
