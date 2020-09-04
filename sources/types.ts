import type { User, ShardingManager } from 'discord.js'
import type { Client } from './client/Client'

export type Opaque<K, U> = K & { __TYPE__: U }
export type Params<F extends (...args: unknown[]) => unknown> = F extends (
  ...args: infer U
) => unknown
  ? U
  : never
export type Head<T extends unknown[]> = T extends [unknown, ...unknown[]] ? T[0] : never
export type Tail<T extends unknown[]> = ((...t: T) => unknown) extends (
  _: unknown,
  ...tail: infer P
) => unknown
  ? P
  : []
export type Snowflake = Opaque<string, 'Snowflake'>

export type Filters = {
  bassboost: 'bass=g=20,dynaudnorm=f=200'
  '8D': 'apulsator=hz=0.08'
  vaporwave: 'aresample=48000,asetrate=48000*0.8'
  nightcore: 'aresample=48000,asetrate=48000*1.25'
  phaser: 'aphaser=in_gain=0.4'
  tremolo: 'tremolo'
  vibrato: 'vibrato=f=6.5'
  reverse: 'areverse'
  treble: 'treble=g=5'
  normalizer: 'dynaudnorm=f=200'
  surrounding: 'surround'
  pulsator: 'apulsator=hz=1'
  subboost: 'asubboost'
  karaoke: 'stereotools=mlev=0.03'
  flanger: 'flanger'
  gate: 'agate'
  haas: 'haas'
  mcompand: 'mcompand'
}

export type Queue = {
  playing: Track
  isPlaying: boolean
  volume: number
  repeat: boolean
  filters: Filters
}

export type Track = {
  name: string
  uri: string
  duration: number
  description?: string
  thumbnail: string
  requestedBy: User | undefined
  fromPlaylist?: boolean
  queue: Queue
}

export type CommandOptions = {
  client: Client
}

export type TaskOptions = {
  name: string
  description?: string
}

export type ShardOptions = NonNullable<ConstructorParameters<typeof ShardingManager>[1]>

export type AudioManagerOptions = {
  leaveOnEnd?: boolean
  leaveOnQueueEmpty?: boolean
  pauseOnNobodyListening?: boolean
}

export type LocaleDataSet = typeof import('../locales/en_US.json')
