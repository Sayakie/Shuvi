import { debug as debugWrapper } from 'debug'
import { inspect } from 'util'
import { Config } from './bootstrap/Config'
import { ShardManager } from './bootstrap/ShardManager'
import { EVENT } from './helpers/Constants'

const debug = debugWrapper('Shuvi')

process.on('SIGINT', () => {
  shardManager.shards.forEach(shard => {
    debug('Kill all shards.')
    shard.kill()
  })
})

process.on('SIGHUP', () => {
  shardManager.shards.forEach(shard => {
    debug('Kill all shards before nodemon restart the master.')
    shard.kill()
  })
  process.kill(0)
})

await Config.parse()

const shardManager = new ShardManager()
shardManager.on(EVENT.SHARD_CREATE, shard => {
  debug(`[Shard ${shard.id}] Shard was created!`)
  shard.on(EVENT.ERROR, console.error)
  shard.on(EVENT.CLIENT_READY, () => {
    debug(`[Shard ${shard.id}] Shard is ready.`)
    shard.worker = null
  })
  shard.on(EVENT.MESSAGE_CREATE, data =>
    console.log(`Received ${inspect(data, undefined, 2, true)}`)
  )
  shard.on(EVENT.SHARD_DEATH, process =>
    debug(
      `[Shard ${shard.id}] Shard process was dead. {exitCode: ${process.exitCode || 'no provided'}}`
    )
  )
})

await shardManager.spawn()
