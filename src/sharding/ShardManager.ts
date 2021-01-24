import { ShardClientUtil, ShardingManager } from 'discord.js'
import { extname, join } from 'path'
import { Shard } from './Shard'
import { EVENT } from '../shared/Constants'
import { $main } from '../shared/Path'
import type { Snowflake } from '../types'

const defaultOptions: ShardManagerOptions = {
  file: `${join($main, `App${extname(import.meta.url)}`)}`,
  totalShards: 1,
  mode: 'process',
  respawn: true
}

export type ShardManagerOptions = NonNullable<ConstructorParameters<typeof ShardingManager>[1]> & {
  file?: string
}

export class ShardManager extends ShardingManager {
  constructor(customOptions: ShardManagerOptions = {}) {
    // Use `Set` then spread to get unique values
    const execArgv = [
      ...new Set([
        '--experimental-modules',
        '--es-module-specifier-resolution=node',
        '--unhandled-rejections=strict'
      ]),
      ...['-r', 'esm', '-r', 'ts-node/register']
    ]
    const options = {
      ...defaultOptions,
      execArgv,
      ...customOptions
    }
    const { file } = options

    super(file!, options)
  }

  shardIDForGuildID(guildID: Snowflake, shardCount: number): number {
    return ShardClientUtil.shardIDForGuildID(guildID, shardCount)
  }

  createShard(id = this.shards.size): Shard {
    const shard = new Shard(this, id)
    this.shards.set(id, shard)

    this.emit(EVENT.SHARD_CREATE, shard)
    return shard
  }
}
