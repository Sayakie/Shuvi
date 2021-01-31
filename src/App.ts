/* eslint-disable @typescript-eslint/no-misused-promises */
import { Client as DiscordClient, Collection } from 'discord.js'
import walkSync from 'walk-sync'
import { ShardIsNotSetupError } from './errors/ShardIsNotSetupError'
import { core as debug } from './helpers/debugger'
import { AudioManager } from './managers/AudioManager'
import { DataManager } from './managers/DataManager'
import { TaskManager } from './managers/TaskManager'
import { EVENT } from './shared/Constants'
import { $main } from './shared/Path'
import { cast, check } from './utils'
import type { ClientOptions, Guild, Message, MessageEmbedOptions, Snowflake } from 'discord.js'
import type { Module } from './structs/Module'
import type { ModuleEntry, PluginEntry } from './types'

process.on('uncaughtException', (e) => console.error(e))
process.on('unhandledRejection', (e) => console.error(e))
;(['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGKILL', 'SIGTERM'] as NodeJS.Signals[]).forEach((signal) => {
  process.on(signal, () => {
    /** handles that signal and do nothing */
    return debug(`Received Signal { ${signal} } but do nothing.`)
  })
})

export type walkSyncOptions = Parameters<typeof walkSync>[1]
export type guildSettings = {
  invoke: string
  welcomeMessage: {
    type?: 'dm' | 'specified_channel'
    channelId?: string | null
    content?: string | Partial<MessageEmbedOptions>
  }
  welcomeRole: {
    timing?: 'always' | 'captcha' | 'react'
    roleId?: string | null
    channelId?: string | null
  }
  disableMentions: NonNullable<ClientOptions['disableMentions']>
  allowedMentions: Snowflake[]
}

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
  private modules: Collection<string, Module>
  private aliases: Collection<string, Module>
  private plugins: Array<FunctionConstructor>

  #observer: unknown

  #audioManager: AudioManager
  #dataManager: DataManager
  #taskManager: TaskManager

  private constructor(
    options: ClientOptions = {
      messageCacheMaxSize: cast('CLIENT_MESSAGE_CACHE_SIZE', 'number', 1000),
      messageCacheLifetime: cast('CLIENT_MESSAGE_CACHE_LIFETIME', 'number', 3600),
      messageSweepInterval: cast('CLIENT_MESSAGE_SWEEP_INTERVAL', 'number', 300),
      presence: {
        status: cast('CLIENT_STATUS', 'string', 'online'),
        activity: {
          name: CLIENT_ACTIVITY_NAME,
          type: CLIENT_ACTIVITY_TYPE,
          url: CLIENT_ACTIVITY_URL
        }
      }
    }
  ) {
    super(options)

    if (!this.shard) throw new ShardIsNotSetupError()

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const client = this
    this.modules = new Collection()
    this.aliases = new Collection()
    this.plugins = []
    this.#audioManager = new AudioManager({ client })
    this.#dataManager = new DataManager({ client })
    this.#taskManager = new TaskManager({ client })
    void this.loadModules()
    void this.loadPlugins()
    void this.bindEvents()
    void this.login()
  }

  private static instance: Client

  /**
   * Initiates the client.
   *
   * @param {ClientOptions} [options] Options for a client
   * @return {Promise<Client>} The Shuvi client
   */
  public static async initialise(options?: ClientOptions): Promise<Client> {
    if (this.instance) return Promise.resolve(this.instance)

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

  public static guildSettings: guildSettings = {
    invoke: cast('CLIENT_INVOKE', 'string', '+'),
    welcomeMessage: {},
    welcomeRole: {},
    disableMentions: 'none',
    allowedMentions: ['']
  }

  get observer(): unknown {
    return check(this.#observer)
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

  /**
   * Increments max listeners by one, if they are not zero.
   *
   * @param {number} [count]
   * @see {@link https://github.com/discordjs/discord.js/blob/master/src/client/BaseClient.js#L146|Original source}
   */
  public incrementMaxListener(count = 1): void {
    const maxListeners = this.getMaxListeners()
    if (maxListeners !== 0) {
      this.setMaxListeners(maxListeners + count)
    }
  }

  /**
   * Decrements max listeners by one, if they are not zero.
   *
   * @param {number} [count]
   * @see {@link https://github.com/discordjs/discord.js/blob/master/src/client/BaseClient.js#L157|Original source}
   */
  public decrementMaxListener(count = 1): void {
    const maxListeners = this.getMaxListeners()
    if (maxListeners !== 0 && maxListeners - count >= 0) {
      this.setMaxListeners(maxListeners - count)
    }
  }

  private async loadModules(dir = 'modules') {
    debug(`load client modules.`)
    const entries = walkSync(`${$main}/${dir}`, walkSyncOptions)

    // eslint-disable-next-line no-loops/no-loops
    for (const Entry of entries) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const moduleEntry: ModuleEntry = await import(`${Entry}`)

      // eslint-disable-next-line new-cap
      const Module = new moduleEntry.default({ client: this })
      debug(`Loaded <Module {${Module.name}}`)

      this.modules.set(Module.name.toLowerCase(), Module)
      Module.aliases.forEach((alias) => {
        this.aliases.set(alias.toLowerCase(), Module)
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

      const cleanup = plugin.default({ client: this })
      this.plugins.push(cleanup)
    }
  }

  public async loadGuildSettings(guild: Guild): Promise<guildSettings> {
    const NullableGuildSettings = await this.dataManager.guilds.get(guild.id)
    if (!NullableGuildSettings) {
      debug(
        `Guild <${guild.name}(${guild.id})> seems do not have guild settings.\nSo Client created a new settings for it!`
      )

      const guildSettings = JSON.stringify(Client.guildSettings)

      await this.dataManager.guilds.put(guild.id, guildSettings)
      return Client.guildSettings
    }

    const guildSettings = JSON.parse(NullableGuildSettings) as guildSettings

    return guildSettings
  }

  private async onPrivateMessage(message: Message): Promise<void> {
    await message.reply(message.content)
  }

  private async onMessage(message: Message): Promise<void> {
    // Prevents incoming message from system
    if (message.system) return

    // Prevent incoming message from direct/private
    if (!message.guild) {
      return await this.onPrivateMessage(message)
    }

    const guildSettings = await this.loadGuildSettings(message.guild)

    // Prevent message did not matches
    if (!message.cleanContent.startsWith(guildSettings.invoke) || message.author.equals(this.user!))
      return

    const args = message.cleanContent.slice(guildSettings.invoke.length).trim().split(/\s+/g)
    const token = args.shift()!.toLowerCase()

    // Early return that did not match any modules
    if (!(this.modules.has(token) || this.aliases.has(token))) {
      await message.reply(`${token} 명령이 없습니다!`)
      return
    }

    try {
      const module = this.modules.get(token)! || this.aliases.get(token)!

      await module.inject(message, args).run()
    } catch (error) {
      await message.reply(`명령을 실행하는데 에러가 발생했어요! ${error as string}`)
      console.error(error)
    }
  }

  private bindEvents(): void {
    this.on(EVENT.MESSAGE_CREATE, async (message) => await this.onMessage(message))
  }

  public destroy(): void {
    this.plugins.forEach((pluginCleanup) => {
      debug(`Detach plugin...`)
      pluginCleanup()
    })

    super.destroy()
  }

  public toString(): string {
    return `Shuvi {modules=${this.modules.size}, plugins=${this.plugins.length}, uptime=${this
      .uptime!}}`
  }
}

const mockInitialise = async () => {
  const mockClient = { shard: null } as Client

  return Promise.resolve(mockClient)
}

const onConnect = async (client: Client) => {
  if (client.shard) await client.shard.send({ type: 'undefined', payload: client })
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
