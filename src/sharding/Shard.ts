import { Shard as DiscordShard } from 'discord.js'
import { default as parseVariables } from 'dotenv-parse-variables'
import type { DotenvParseOutput } from 'dotenv/types'
import type { ShardManager } from './ShardManager'

export class Shard extends DiscordShard {
  constructor(manager: ShardManager, id: number) {
    super(manager, id)

    process.env = this.env = (<unknown>(
      parseVariables(this.env as DotenvParseOutput)
    )) as NodeJS.ProcessEnv
    console.log(this.env)
    this.worker = null
  }
}
