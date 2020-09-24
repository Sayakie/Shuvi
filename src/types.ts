import type { ShardingManager } from 'discord.js'
import type Enmap from 'enmap'
import type { LoggerOptions as WinstonLoggerOptions } from 'winston'
import type { Client } from './Client'
import type { GiveawayManager } from './managers/GiveawayManager'
import type { Module } from './structs/Module'

export type Opaque<K, T> = K & { __TYPE__: T }
export type LengthOfTuple<T> = T extends { length: infer L } ? L : never
export type Head<T extends unknown[]> = T extends [unknown, ...unknown[]] ? T[0] : never
export type Tail<T extends unknown[]> = ((...args: T) => unknown) extends (
  arg: unknown,
  ...rest: infer U
) => unknown
  ? U
  : T
export type Last<T extends unknown[]> = T[LengthOfTuple<Tail<T>>]
export type Snowflake = Opaque<string, 'Snowflake'>
export type Timestamp = Opaque<number, 'Timestamp'>
export type GuildOptions = {
  commandPrefix: string
  ignoreBot: boolean
}
export type ShardManagerOptions = NonNullable<
  Last<ConstructorParameters<typeof ShardingManager>>
> & {
  file?: string
}
export type ModuleOptions = {
  client: Client
}
export type ModuleEntry = {
  default: new (options: ModuleOptions) => Module
}
export type PluginEntry = {
  default: (options: ModuleOptions) => Module | Promise<Module>
}
export type DataID = Opaque<string, 'DataTable'>
export type DataOptions = NonNullable<
  Exclude<
    Last<ConstructorParameters<typeof Enmap>>,
    string | Iterable<[string | number, unknown]>
  > & { name: DataID }
>
export type TaskUniqueName = Opaque<string, 'Task'>
export type TaskOptions = {
  name?: TaskUniqueName
  description?: string
  timeout: Timestamp
}
export type GiveawayOptions = {
  client: Client
  manager: GiveawayManager
}
export type GiveawayManagerOptions = {
  startsAt?: number
  endsAt?: number
  enbed?: boolean
  prize?: string
  channelID?: Snowflake
  guildID?: Snowflake
  winnerCount?: number
  hostedBy?: string
}
export type LoggerLevel = 'info' | 'warn' | 'error' | 'crit' | 'fatal'
export type LoggerOptions = WinstonLoggerOptions & { name?: string; level?: LoggerLevel }

export type ProcessEnvProperty = {
  NODE_ENV: 'development' | 'production' | 'debug' | 'test'
  DISCORD_TOKEN: string
  DISCORD_PREFIX: string

  CLIENT_BOOT_TIMEOUT: string
  CLIENT_MESSAGE_CACHE_SIZE: string
  CLIENT_MESSAGE_CACHE_LIFETIME: string
  CLIENT_MESSAGE_SWEEP_INTERVAL: string
  CLIENT_STATUS: string
  CLIENT_ACTIVITY_NAME: string
  CLIENT_ACTIVITY_TYPE: string
  CLIENT_ACTIVITY_URL: string

  OWNERS: string[]
}
