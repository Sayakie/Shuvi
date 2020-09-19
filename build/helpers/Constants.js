import { Constants } from 'discord.js';
const { Events: DiscordEvents } = Constants;
export const DISCORD_EPOCH = 1420070400000;
export const EVENT = {
    ...DiscordEvents,
    ...{
        PING: 'ping',
        PONG: 'pong',
        DATA: 'data',
        DESTROY: 'destroy',
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
        TASK_RELOAD: 'taskReload'
    }
};
export const SYMBOL = {
    NOT_EXISTS: '',
    WHITESPACE: ' ',
    NEWLINE: '\n'
};
export const PATTERN = {
    MENTION: /<(?:(?:@[!&]?)|#)(?<id>\d+)>/i,
    MENTION_USER: /<@!?(?<id>\d+)>/i,
    MENTION_USER_ID: /<@(?<id>\d+)>/i,
    MENTION_USER_NICKNAME: /<@!(?<id>\d+)>/i,
    MENTION_CHANNEL: /<#(?<id>\d+)>/i,
    MENTION_ROLE: /<@&(?<id>\d+)>/i,
    EMOJI: /<a?:(?<name>.+):(?<id>.+):>/i,
    CUSTOM_EMOJI: /<:(?<name>.+):(?<id>.+)>/i,
    ANIMATED_EMOJI: /<a:(?<name>.+):(?<id>.+)>/i,
    NEWLINES: /\n|\r|\r\n/
};
