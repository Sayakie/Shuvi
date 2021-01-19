Error.stackTraceLimit = 10
process.on('uncaughtException', console.error)
process.on('unhandledRejection', console.error)

import './bootloader/bootstrap'
import { Config } from './bootloader/Config'
await Config.parse()

import chalk from 'chalk'
import { ShardManager } from './sharding/ShardManager'
import { core as debug } from './helpers/debugger'
import { EVENT } from './shared/Constants'
;(['SIGINT', 'SIGHUP'] as NodeJS.Signals[]).forEach(signal => {
  process.on(signal, () => {
    debug('Destroy all shards.')
    shardManager.shards.forEach(shard => shard.kill())
  })
})

const shardManager = new ShardManager()
shardManager.on(EVENT.SHARD_CREATE, shard => {
  debug(
    `${
      chalk.white` [ ` +
      chalk.cyanBright`Shard ${shard.id}` +
      chalk.white` ] ` +
      chalk.greenBright`Shard is created!`
    }`
  )

  shard.on(EVENT.ERROR, console.error)
  shard.on(EVENT.SHARD_READY, () => {
    debug(
      `${
        chalk.white` [ ` +
        chalk.cyanBright`Shard ${shard.id}` +
        chalk.white` ] ` +
        chalk.greenBright`Shard is ready!`
      }`
    )
  })
  shard.on(EVENT.SHARD_DEATH, process => {
    if (process.exitCode === 0) return

    debug(
      `${
        chalk.white` [ ` +
        chalk.cyanBright`Shard ${shard.id}` +
        chalk.white` ] ` +
        chalk.redBright`Shard is dead suddenly. exitCode: ${process.exitCode || 'no provided'}`
      }`
    )
  })
})

await shardManager.spawn()
