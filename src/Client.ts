import { debug as debugWrapper } from 'debug'
import { Client as DiscordClient, Collection } from 'discord.js'
import walkSync from 'walk-sync'
import { EVENT } from './helpers/Constants'
import { $main } from './helpers/Path'
import { AudioManager } from './managers/AudioManager'
import { DataManager } from './managers/DataManager'
import { TaskManager } from './managers/TaskManager'
import { ShardIsNotSetError } from './error/ShardIsNotSetError'
import { check, cast } from './utils'
import { inspect } from 'util'
import type { ActivityType, ClientOptions, PresenceStatusData, Message } from 'discord.js'
import type Enmap from 'enmap'
import type { Module } from './structs/Module'
import type { DataID, GuildOptions, ModuleEntry, PluginEntry } from './types'

const debug = debugWrapper('Shuvi:Client')
;['SIGINT', 'SIGHUP'].forEach(SIGNAL =>
  process.once(SIGNAL as NodeJS.Signals, () => {
    /** handles that signal and do nothing */
  })
)

process.on('uncaughtException', console.error)
process.on('unhandledRejection', console.error)

const { SHUVI_LAZY_INITIALISE, RUNTIME_MODE } = process.env

/** Shuvi client instance. */
let client: Client

const guildSettings: GuildOptions = {
  commandPrefix: cast('DISCORD_PREFIX', 'string', '!!'),
  ignoreBot: cast('IGNORE_BOT', 'boolean', true)
}

const walkSyncOptions: Parameters<typeof walkSync>[1] = {
  includeBasePath: true,
  directories: false,
  globs: ['**/*.+(ts|js)'],
  ignore: ['test/**/*', '*.__test__.+(ts|js)', '*.test.+(ts|js)']
}

/**
 * Shuvi core, the main starting point of bot.
 * It extends Discord.js core client so that
 * allows more flexible design to do actions.
 *
 * @private
 * @hideconstructor
 * @alias Client
 * @extends DiscordClient
 * @example
 * process.env.SHUVI_LAZY_INITIALISE = true // Set value to truthy for lazy initiate
 *
 * import { Client } from 'Sayakie/Client'
 * Client.initialise()
 */
export class Client extends DiscordClient {
  #modules: Collection<string, Module>
  #aliases: Collection<string, Module>

  #audioManager: AudioManager
  #dataManager: DataManager
  #taskManager: TaskManager

  settings: Enmap<string, GuildOptions>

  private constructor(
    options: ClientOptions = {
      messageCacheMaxSize: cast('CLIENT_MESSAGE_CACHE_SIZE', 'number', 1000),
      messageCacheLifetime: cast('CLIENT_MESSAGE_CACHE_LIFETIME', 'number', 3600),
      messageSweepInterval: cast('CLIENT_MESSAGE_SWEEP_INTERVAL', 'number', 300),
      presence: {
        status: cast('CLIENT_STATUS', 'string', 'online' as PresenceStatusData),
        activity: {
          name: cast('CLIENT_ACTIVITY_NAME', 'string', undefined),
          type: cast('CLIENT_ACTIVITY_TYPE', 'string', undefined as ActivityType | undefined),
          url: cast('CLIENT_ACTIVITY_URL', 'string', undefined)
        }
      }
    }
  ) {
    super(options)

    if (!this.shard) throw new ShardIsNotSetError()

    this.#modules = new Collection()
    this.#aliases = new Collection()
    this.#audioManager = new AudioManager()
    this.#dataManager = new DataManager()
    this.#taskManager = new TaskManager()
    this.settings = this.#dataManager.create<GuildOptions>({ name: 'guilds' as DataID })
    this.settings.defer
    this.loadModules()
    this.loadPlugins()
    RUNTIME_MODE === 'izuna-bot' && this.loadModules('izuna')
    this.bindEvents()
    this.login()
  }

  /**
   * Initiates the client.
   *
   * @async
   * @static
   * @function Shuvi#initialise
   * @param {ClientOptions} [options] Options that client config to set.
   * @return {Promise<Client>} The Shuvi client.
   */
  static async initialise(options?: ClientOptions): Promise<Client> {
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        clearTimeout(clientTimeout)
        client.off(EVENT.CLIENT_READY, onReady)
      }

      const onReady = () => {
        cleanup()
        resolve(client)
      }

      const onTimeout = () => {
        cleanup()
        reject(new Error('Client timed out.'))
      }

      const TIMEOUT = cast('CLIENT_BOOT_TIMEOUT', 'number', 25600)
      const clientTimeout = setTimeout(onTimeout, TIMEOUT)
      client = new Client(options)
      client.once(EVENT.CLIENT_READY, onReady)
    })
  }

  get audioManager(): AudioManager {
    return check(this.#audioManager)
  }

  get dataManager(): DataManager {
    return check(this.#dataManager)
  }

  get taskManager(): TaskManager {
    return check(this.#taskManager)
  }

  get modules(): Collection<string, Module> {
    return this.#modules
  }

  get aliases(): Collection<string, Module> {
    return this.#aliases
  }

  /**
   * Increments max listeners by one, if they are not zero.
   * @see {@link https://github.com/discordjs/discord.js/blob/master/src/client/BaseClient.js#L146|Original source}
   */
  incrementMaxListener(): void {
    const maxListeners = this.getMaxListeners()
    if (maxListeners !== 0) {
      this.setMaxListeners(maxListeners + 1)
    }
  }

  /**
   * Decrements max listeners by one, if they are not zero.
   * @see {@link https://github.com/discordjs/discord.js/blob/master/src/client/BaseClient.js#L157|Original source}
   */
  decrementMaxListener(): void {
    const maxListeners = this.getMaxListeners()
    if (maxListeners !== 0) {
      this.setMaxListeners(maxListeners - 1)
    }
  }

  private async loadModules(directory = 'modules') {
    debug(`load client modules`)
    const entries = walkSync(`${$main}/${directory}`, walkSyncOptions)

    // eslint-disable-next-line no-loops/no-loops
    for (const Entry of entries) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const module: ModuleEntry = await import(`${Entry}`)

      // eslint-disable-next-line new-cap
      const initiatedModule = new module.default({ client: this })
      debug(`Loaded ${initiatedModule.name}`)

      this.#modules.set(initiatedModule.name.toLowerCase(), initiatedModule)
      initiatedModule.aliases.forEach(alias => {
        this.#aliases.set(alias.toLowerCase(), initiatedModule)
      })
    }
  }

  private async loadPlugins() {
    debug(`load client plugins`)
    const entries = walkSync(`${$main}/plugins`, walkSyncOptions)

    // eslint-disable-next-line no-loops/no-loops
    for (const Entry of entries) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const plugin: PluginEntry = await import(`${Entry}`)

      await plugin.default({ client: this })
    }
  }

  async onDirectMessage(message: Message): Promise<void> {
    await message.author.send(message.cleanContent)
  }

  async onMessage(message: Message): Promise<void> {
    // Prevents message incoming from Discord System
    if (message.system) return

    // Handles message incoming from private like DMChannel
    if (!message.guild) {
      await this.onDirectMessage(message)
      return
    }

    const guildSetting = this.settings.ensure(message.guild.id, guildSettings)

    // Prevents message that did not start with valid prefix
    if (
      !message.cleanContent.startsWith(guildSetting.commandPrefix) ||
      (guildSetting.ignoreBot && message.author.bot) ||
      message.author.equals(this.user!)
    )
      return

    const args = message.cleanContent.slice(guildSetting.commandPrefix.length).trim().split(/\s+/g)
    const token = args.shift()!.toLowerCase()

    // Enters into early return to do nothing that did not match any modules
    if (!(this.#modules.has(token) || this.#aliases.has(token))) {
      await message.author.send(`Could not found the command: ${token}`)
      return
    }

    try {
      const module = this.#modules.get(token)! || this.#aliases.get(token)!

      await module.inject(message, args).run()
    } catch (error) {
      await message.channel.send('There was an error while run that command!')
      console.error(error)
    }
  }

  bindEvents(): void {
    this.on(EVENT.CLIENT_READY, () => {
      this.guilds.cache.forEach(guild => {
        this.settings.ensure(guild.id, guildSettings)
      })
      console.log(inspect(this.settings, undefined, 2, true))
    })
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.on(EVENT.MESSAGE_CREATE, async message => await this.onMessage(message))
    this.on(EVENT.GUILD_CREATE, guild => {
      this.settings.ensure(guild.id, guildSettings)
    })
    this.on(EVENT.GUILD_DELETE, guild => {
      this.settings.delete(guild.id)
    })
  }

  toString(): string {
    return `Shuvi {modules=${this.#modules.size}, plugins=0, uptime=${this.uptime!}}`
  }
}

const mockInitialise = async () => {
  const mockClient = { shard: null } as Client

  return Promise.resolve(mockClient)
}
const onConnect = (client: Client) => {
  if (client.shard) client.shard.send({ type: 'undefined', client })
}
const onFailed = (error: string) => {
  console.error(error)
  process.kill(1)
}

void (async () => {
  if (SHUVI_LAZY_INITIALISE) return await mockInitialise()
  return await Client.initialise()
})()
  .then(onConnect)
  .catch(onFailed)
