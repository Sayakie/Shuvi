import { ShardingManager } from 'discord.js'
import { Application } from '../App'
import type { Logger } from '../structures/Logger'
import type { ShardOptions } from '../types'

export class ShardManager extends ShardingManager {
  public logger: Logger

  constructor(file: string, options?: ShardOptions) {
    options = Object.assign(
      {
        totalShards: 1,
        mode: 'worker',
        respawn: true,
        shardArgs: [(process.env.NODE_ENV === 'development' && '') || '']
      } as ShardOptions,
      options
    )

    super(file, options)
    this.logger = Application.logManager.create({ name: this.constructor.name })
    this.logger.log(`Launching ${options.totalShards!} shard${options.totalShards! > 1 ? 's' : ''}`)
  }
}
