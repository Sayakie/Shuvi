import { Constants as DiscordConstants } from 'discord.js'

const { Events: DiscordEvents } = DiscordConstants

/** Discord epoch (2015-01-01T00:00:00.000Z) */
export const DISCORD_EPOCH = 1420070400000

export const EVENT = {
  ...DiscordEvents,
  ...({
    PING: 'ping',
    PONG: 'pong',
    DATA: 'data',
    DESTROY: 'destroy',
    DATASET_READY: 'datasetReady',
    DATASET_SENDER: 'datasetSender',
    DATASET_RECEIVER: 'datasetReceiver',
    DATASET_UNREACHABLE: 'datasetUnreachable',
    SHARD_CREATE: 'shardCreate',
    SHARD_READY: 'ready',
    SHARD_DEATH: 'death',
    TASK_CREATE: 'taskCreate',
    TASK_DELETE: 'taskDelete',
    TASK_UPDATE: 'taskUpdate',
    TASK_BULK_DELETE: 'taskDeleteBulk',
    TASK_SUBSCRIBE: 'taskSubscribe',
    TASK_UNSUBSCRIBE: 'taskUnsubscribe',
    TASK_READY: 'taskReady',
    TASK_START: 'taskStart',
    TASK_END: 'taskEnd',
    TASK_RELOAD: 'taskReload',
    TASK_RELOAD_ALL: 'taskReloadAll'
  } as const)
}

export const SYMBOL = {
  NOT_EXISTS: '',
  WHITESPACE: ' ',
  NEWLINE: '\n'
} as const

export const PATTERN = {
  MENTION: /<(?:(?:@[!&]?)|#)(?<id>\d+)>/i,
  MENTION_USER: /<@!?(?<id>\d+)>/i,
  MENTION_USER_ID: /<@(?<id>\d+)>/i,
  MENTION_USER_NICKNAME: /<@!(?<id>\d+)>/i,
  MENTION_CHANNEL: /<#(?<id>\d+)>/i,
  MENTION_ROLE: /<@&(?<id>\d+)>/i,
  EMOJI: /<(?<animation>a)?:(?<name>.+):(?<id>.+)>/i,
  CUSTOM_EMOJI: /<:(?<name>.+):(?<id>.+)>/i,
  ANIMATED_EMOJI: /<a:(?<name>.+):(?<id>.+)>/i,
  ENGLISH_ONLY: /^[A-Za-z][A-Za-z0-9]*$/,
  WHITESPACE: /\s+/g,
  NEWLINES: /\n|\r|\r\n/
}
