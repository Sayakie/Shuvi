import { ShardingManager } from 'discord.js'
import type { ShardOptions } from '../types'

export class ShardManager extends ShardingManager {
  constructor(file: string, options?: ShardOptions) {
    super(file, options)
  }
}
