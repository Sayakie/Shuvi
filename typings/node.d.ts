declare namespace NodeJS {
  import type { ActivityType, PresenceStatusData } from 'discord.js'

  type NodeEnvironment = 'production' | 'development' | 'debug' | 'test'

  interface ProcessEnv {
    SHUVI_LAZY_INITIALISE: boolean

    NODE_ENV: NodeEnvironment
    SHUVI_ENV: 'izuna' | undefined

    DISCORD_TOKEN: string
    DISCORD_INVOKE: string
    IGNORE_BOT: boolean

    CLIENT_BOOT_TIMEOUT: number
    CLIENT_MESSAGE_CACHE_SIZE: number
    CLIENT_MESSAGE_CACHE_LIFETIME: number
    CLIENT_MESSAGE_SWEEP_INTERVAL: number

    CLIENT_STATUS: PresenceStatusData
    CLIENT_ACTIVITY_NAME: string
    CLIENT_ACTIVITY_TYPE: ActivityType
    CLIENT_ACTIVITY_URL: string

    OWNERS: Array<string | number>
  }
}
