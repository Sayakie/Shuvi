import { Guild } from 'discord.js'
import { Client } from '../client/Client'
import type { Queue, AudioManagerOptions, Snowflake } from '../types'

const baseOptions: Required<AudioManagerOptions> = {
  leaveOnEnd: true,
  leaveOnQueueEmpty: true,
  pauseOnNobodyListening: true
}

export class AudioManager {
  private _client: Client
  private _options: Required<AudioManagerOptions>
  private _queues: WeakMap<Guild, Queue[]>

  constructor(client: Client, options: AudioManagerOptions = {}) {
    if (!(client instanceof Client)) throw new SyntaxError('Client is not an expected client.')

    this._client = client
    this._options = Object.assign({}, baseOptions, options)
    this._queues = new WeakMap()
  }

  public get client(): audioManager['_client'] {
    return this._client
  }

  public get options(): audioManager['_options'] {
    return this._options
  }

  public get queues(): audioManager['_queues'] {
    return this._queues
  }

  /** Whether the guild is currently playing something */
  public isPlaying(guild: Guild | Snowflake): boolean {
    if (guild instanceof Guild) {
      guild = guild.id as Snowflake
    }

    if (!this.client.guilds.cache.has(guild)) return false
    return this.queues.has(this.client.guilds.resolve(guild)!)
  }
}
