import walkSync from 'walk-sync'
import { Client } from './client/Client'
import { EVENT, LOGGER } from './config/Constants'
import { $project } from './config/PathFinder'
import { AudioManager } from './managers/AudioManager'
import { DataManager } from './managers/DataManager'
import { EnvManager } from './managers/EnvManager'
import { LocaleManager } from './managers/LocaleManager'
import { LogManager } from './managers/LogManager'
import { ShardManager } from './managers/ShardManager'
import { TaskManager } from './managers/TaskManager'
import type { Logger } from './structures/Logger'
import type {
  ClientVoiceManager as VoiceManager,
  GuildManager,
  UserManager,
  WebSocketManager
} from 'discord.js'
import type { ApplicationOptions, ModuleObject } from './types'

const check = (instance: unknown) => {
  if (typeof instance === 'undefined') {
    throw new Error(
      `${
        ((instance as unknown) as (T: unknown) => typeof T).constructor.name
      } has not been initialized!`
    )
  }

  return instance
}

export class Application {
  private static _instance: Application
  #client: Client
  #audioManager: AudioManager
  #dataManager: DataManager
  #envManager: EnvManager
  #localeManager: LocaleManager
  #logManager: LogManager
  #shardManager: ShardManager
  #taskManager: TaskManager
  public static get instance(): Application {
    return check(this._instance) as Application
  }
  public static get audioManager(): AudioManager {
    return check(Application.instance.#audioManager) as AudioManager
  }
  public static get dataManager(): DataManager {
    return check(Application.instance.#dataManager) as DataManager
  }
  public static get envManager(): EnvManager {
    return check(Application.instance.#envManager) as EnvManager
  }
  public static get localeManager(): LocaleManager {
    return check(Application.instance.#localeManager) as LocaleManager
  }
  public static get logManager(): LogManager {
    return check(Application.instance.#logManager) as LogManager
  }
  public static get shardManager(): ShardManager {
    return check(Application.instance.#shardManager) as ShardManager
  }
  public static get taskManager(): TaskManager {
    return check(Application.instance.#taskManager) as TaskManager
  }
  public static get guildManager(): GuildManager {
    return check(Application.instance.client.guilds) as GuildManager
  }

  public static get userManager(): UserManager {
    return check(Application.instance.client.users) as UserManager
  }

  public static get voiceManager(): VoiceManager {
    return check(Application.instance.client.voice) as VoiceManager
  }

  public static get socketManager(): WebSocketManager {
    return check(Application.instance.client.ws) as WebSocketManager
  }

  public logger: Logger

  private constructor(options?: ApplicationOptions) {
    this.#audioManager = new AudioManager(this.client)
    this.#dataManager = new DataManager()
    this.#envManager = new EnvManager()
    this.#localeManager = new LocaleManager()
    this.#logManager = new LogManager()
    this.#shardManager = new ShardManager('index')
    this.#taskManager = new TaskManager()
    this.#client = (this.#shardManager.shards.get(0)! as unknown) as Client
    this.logger = this.#logManager.create({ name: LOGGER.CORE, ...options?.loggerOptions })
    this.fetchModules()
    this.attachEvents()
    this.client.login(options?.clientOptions?.token)
  }

  public async bootstrap(): Promise<void> {
    // const console = this.#logManager.create({ name: LOGGER.CORE })

    return new Promise((resolve, reject) => {
      if (!Application._instance) {
        Application._instance = new Application()
        resolve()
      } else {
        reject()
      }
    })
  }

  public get client(): Client {
    return this.#client
  }

  private async fetchModules(): Promise<void> {
    const moduleEntries = walkSync(`${$project}/modules`, {
      includeBasePath: true,
      directories: false,
      globs: ['**/*.+(ts|js)']
    })

    // eslint-disable-next-line no-loops/no-loops
    for (const Entry of moduleEntries) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const moduleObject: ModuleObject = await import(Entry)

      const module = new moduleObject({ instance: this })
      this.client.modules.set(module.name, module)
      module.aliases.forEach(alias => this.client.aliases.set(alias, module))
    }
  }

  private attachEvents(): void {
    this.#client.on(EVENT.CLIENT_READY, () => this.clientReady())
  }

  private clientReady(): void {
    this.logger.log(`Client setup!`)
  }
}
