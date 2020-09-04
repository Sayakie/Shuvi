import { Client } from './client/Client'
import { AudioManager } from './managers/AudioManager'
import { DataManager } from './managers/DataManager'
import { EnvManager } from './managers/EnvManager'
import { LocaleManager } from './managers/LocaleManager'
import { LogManager } from './managers/LogManager'
import { ShardManager } from './managers/ShardManager'
import { TaskManager } from './managers/TaskManager'

export class Application {
  private static _instance: Application
  private static _audioManager: AudioManager
  private static _dataManager: DataManager
  private static _envManager: EnvManager
  private static _localeManager: LocaleManager
  private static _logManager: LogManager
  private static _shardManager: ShardManager
  private static _taskManager: TaskManager
  public static get instance(): Application {
    return this._instance
  }
  public static get audioManager(): AudioManager {
    return Application.check(Application._audioManager) as AudioManager
  }
  public static get dataManager(): DataManager {
    return Application.check(Application._dataManager) as DataManager
  }
  public static get envManager(): EnvManager {
    return Application.check(Application._envManager) as EnvManager
  }
  public static get localeManager(): LocaleManager {
    return Application.check(Application._localeManager) as LocaleManager
  }
  public static get logManager(): LogManager {
    return Application.check(Application._logManager) as LogManager
  }
  public static get shardManager(): ShardManager {
    return Application.check(Application._shardManager) as ShardManager
  }
  public static get taskManager(): TaskManager {
    return Application.check(Application._taskManager) as TaskManager
  }

  private client!: Client

  private constructor() {
    this.client = new Client()

    Application._audioManager = new AudioManager(this.client)
    Application._dataManager = new DataManager()
    Application._envManager = new EnvManager()
    Application._localeManager = new LocaleManager()
    Application._logManager = new LogManager()
    Application._shardManager = new ShardManager('index')
    Application._taskManager = new TaskManager()
  }

  public async bootstrap(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!Application._instance) {
        Application._instance = new Application()
        resolve()
      } else {
        reject()
      }
    })
  }

  private static check(instance: unknown) {
    if (typeof instance === 'undefined') {
      throw new Error('Application has not been initialized!')
    }

    return instance
  }

  public static isReady(): boolean {
    if (typeof this.instance === 'undefined') return false
    return this.instance.client.readyTimestamp! > Date.now()
  }
}
