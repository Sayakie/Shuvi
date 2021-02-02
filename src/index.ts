Error.stackTraceLimit = 10
process.on('uncaughtException', (e) => console.error(e))
process.on('unhandledRejection', (e) => console.error(e))

import './bootloader/bootstrap'
import { Config } from './bootloader/Config'
await Config.parse()

import chalk from 'chalk'
import { ShardManager } from './sharding/ShardManager'
import { core as debug } from './helpers/debugger'
import { EVENT } from './shared/Constants'
import { inspect } from 'util'
;(['SIGHUP', 'SIGINT'] as NodeJS.Signals[]).forEach((signal) => {
  process.once(signal, () => {
    debug('Destroy all shards.')
    shardManager.shards.forEach((shard) => shard.kill())
  })
})

const shardManager = new ShardManager()
shardManager.on(EVENT.SHARD_CREATE, (shard) => {
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
  shard.on(EVENT.MESSAGE_CREATE, (data) => {
    ;`${
      chalk.white` [ ` +
      chalk.cyanBright`Shard ${shard.id}` +
      chalk.white` ] ` +
      chalk.greenBright`${inspect(data, true, 2)}`
    }`
  })
  shard.on(EVENT.SHARD_DEATH, (process) => {
    if (process.exitCode === 0) return

    debug(
      `${
        chalk.white` [ ` +
        chalk.cyanBright`Shard ${shard.id}` +
        chalk.white` ] ` +
        chalk.redBright`Shard is dead suddenly. exitCode: ${process.exitCode ?? 'no provided'}`
      }`
    )
  })
})

await shardManager.spawn()
