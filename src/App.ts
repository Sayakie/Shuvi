import { Client as DiscordClient, Collection } from 'discord.js'
import walkSync from 'walk-sync'
import { ShardIsNotSetupError } from './errors/ShardIsNotSetupError'
import { core as debug } from './helpers/debugger'
import { EVENT } from './shared/Constants'
import type { ActivityType, ClientOptions, PresenceStatusData } from 'discord.js'
import { cast } from './utils'
;(['SIGINT', 'SIGHUP'] as NodeJS.Signals[]).forEach(signal => {
  process.on(signal, () => {
    /** handles that signal and do nothing */
    return debug(`Received Signal { ${signal} } but do nothing.`)
  })
})

process.on('uncaughtException', console.error)
process.on('unhandledRejection', console.error)

export type walkSyncOptions = Parameters<typeof walkSync>[1]

const {
  SHUVI_LAZY_INITIALISE,
  CLIENT_BOOT_TIMEOUT = 10000,
  CLIENT_ACTIVITY_NAME,
  CLIENT_ACTIVITY_TYPE,
  CLIENT_ACTIVITY_URL
} = process.env

const walkSyncOptions: walkSyncOptions = {
  includeBasePath: true,
  directories: false,
  globs: ['**/*.+(ts|js)'],
  ignore: ['test/**/*', '*.__test__.+(ts|js)', '*.test.+(ts|js)']
}

/**
 * Shuvi core, the main starting point of bot.
 * It extends Discord.js core client so that
 * allows more flexible design to do custom acts.
 *
 * @private
 * @hideconstructor
 * @example
 * process.env.SHUVI_LAZY_INITIALISE = true  // Set for lazy initiate
 *
 * import { Client } from './App'
 * Client.initialise()
 */
export class Client extends DiscordClient {
  #modules: Collection<string, unknown>
  #aliases: Collection<string, unknown>

  private constructor(
    options: ClientOptions = {
      messageCacheMaxSize: cast('CLIENT_MESSAGE_CACHE_SIZE', 'number', 1000),
      messageCacheLifetime: cast('CLIENT_MESSAGE_CACHE_LIFETIME', 'number', 3600),
      messageSweepInterval: cast('CLIENT_MESSAGE_SWEEP_INTERVAL', 'number', 300),
      presence: {
        status: cast('CLIENT_STATUS', 'string', 'online' as PresenceStatusData),
        activity: {
          name: CLIENT_ACTIVITY_NAME,
          type: CLIENT_ACTIVITY_TYPE as ActivityType,
          url: CLIENT_ACTIVITY_URL
        }
      }
    }
  ) {
    super(options)

    if (!this.shard) throw new ShardIsNotSetupError()

    this.#modules = new Collection()
    this.#aliases = new Collection()
    this.login()
  }

  private static instance: Client

  /**
   * Initiates the client.
   *
   * @param {ClientOptions} [options] Options for a client
   * @return {Promise<Client>} The Shuvi client
   */
  static async initialise(options?: ClientOptions): Promise<Client> {
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        clearTimeout(bootupTimeout)
        this.instance.off(EVENT.CLIENT_READY, onReady)
      }

      const onReady = () => {
        cleanup()
        resolve(this.instance)
      }

      const onTimeout = () => {
        cleanup()
        reject(new Error('Client timed out.'))
      }

      const bootupTimeout = setTimeout(onTimeout, CLIENT_BOOT_TIMEOUT)

      this.instance = new Client(options)
      this.instance.once(EVENT.CLIENT_READY, onReady)
    })
  }

  toString(): string {
    return `Shuvi {modules=${this.#modules.size}, plugins=${this.#aliases.size}, uptime=${this
      .uptime!}}`
  }
}

const mockInitialise = async () => {
  const mockClient = { shard: null } as Client

  return Promise.resolve(mockClient)
}

const onConnect = (client: Client) => {
  if (client.shard) client.shard.send({ type: 'undefined', payload: client })
}

const onFail = (error: string | string[]) => {
  console.error(error)
  process.kill(1)
}

void (async () => {
  if (SHUVI_LAZY_INITIALISE) return await mockInitialise()
  return await Client.initialise()
})()
  .then(onConnect)
  .catch(onFail)
