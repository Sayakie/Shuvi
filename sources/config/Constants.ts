import { Constants } from 'discord.js'

const { Events: DiscordEvents } = Constants

/**
 * Discord epoch (2015-01-01T00:00:00.000Z)
 * @constant @type {Number}
 * */
export const DISCORD_EPOCH = 1420070400000

export const EVENT = Object.assign({}, DiscordEvents, {
  TASK_CREATE: 'taskCreate',
  TASK_DELETE: 'taskDelete',
  TASK_UPDATE: 'taskUpdate',
  TASK_BULK_DELETE: 'taskDeleteBulk',
  TASK_SUBSCRIBE: 'taskSubscribe',
  TASK_UNSUBSCRIBE: 'taskUnsubscribe',
  TASK_READY: 'taskReady',
  TASK_START: 'taskStart',
  TASK_END: 'taskEnd',
  TASK_RELOAD: 'taskReload'
})

export const SYMBOL = {
  NOT_EXISTS: '',
  WHITESPACE: ' '
}
