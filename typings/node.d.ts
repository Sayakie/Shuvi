declare namespace NodeJS {
  // @ts-ignore
  // eslint-disable-next-line spaced-comment, @typescript-eslint/triple-slash-reference
  /// <reference path="../node_modules/discord.js/typings/index.d.ts" />
  import type { ActivityType, PresenceStatusData } from 'discord.js'

  type NodeEnvironment = 'production' | 'development' | 'debug' | 'test'

  interface ShuviProcessEnv {
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

  // @ts-ignore
  interface ProcessEnv extends ShuviProcessEnv {}
}

declare module '@Shuvi/internal' {
  type InternalEnv = NodeJS.ProcessEnv
}
