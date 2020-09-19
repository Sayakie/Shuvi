var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _modules, _dataManager, _taskManager;
import { debug as debugWrapper } from 'debug';
import { Client as DiscordClient, Collection } from 'discord.js';
import walkSync from 'walk-sync';
import { EVENT } from './helpers/Constants';
import { $main } from './helpers/Path';
import { DataManager } from './managers/DataManager';
import { TaskManager } from './managers/TaskManager';
const debug = debugWrapper('Shuvi:Client');
process.on('SIGINT', () => {
    client.destroy();
    debug('Received kill instance.');
});
process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);
const { CLIENT_MESSAGE_CACHE_SIZE, CLIENT_MESSAGE_CACHE_LIFETIME, CLIENT_MESSAGE_SWEEP_INTERVAL, CLIENT_STATUS, CLIENT_ACTIVITY_NAME, CLIENT_ACTIVITY_TYPE, CLIENT_ACTIVITY_URL, SHUVI_LAZY_INITIALISE } = process.env;
const check = (instance) => {
    if (typeof instance === 'undefined') {
        throw new Error('Shuvi has not been initialized.');
    }
    return instance;
};
let _client;
const client = check(_client);
export class Client extends DiscordClient {
    constructor(options = {
        messageCacheMaxSize: +CLIENT_MESSAGE_CACHE_SIZE || 960,
        messageCacheLifetime: +CLIENT_MESSAGE_CACHE_LIFETIME || 3600,
        messageSweepInterval: +CLIENT_MESSAGE_SWEEP_INTERVAL || 300,
        presence: {
            status: CLIENT_STATUS || 'online',
            activity: {
                name: CLIENT_ACTIVITY_NAME,
                type: CLIENT_ACTIVITY_TYPE,
                url: CLIENT_ACTIVITY_URL
            }
        }
    }) {
        super(options);
        _modules.set(this, void 0);
        _dataManager.set(this, void 0);
        _taskManager.set(this, void 0);
        if (!this.shard)
            throw new Error('"shard" is not set. Spawn with bootstrap/ShardManager#spawn().');
        __classPrivateFieldSet(this, _modules, new Collection());
        __classPrivateFieldSet(this, _dataManager, new DataManager());
        __classPrivateFieldSet(this, _taskManager, new TaskManager());
        this.loadModules('modules');
        this.loadModules('plugins');
        this.login();
    }
    static async initialise(options) {
        return new Promise((resolve, reject) => {
            const cleanup = () => {
                clearTimeout(instanceTimeout);
                client.off(EVENT.CLIENT_READY, onReady);
            };
            const onReady = () => {
                cleanup();
                resolve(client);
            };
            const onTimeout = () => {
                cleanup();
                reject(new Error('Client timed out.'));
            };
            const { CLIENT_BOOT_TIMEOUT: TIMEOUT } = process.env;
            const instanceTimeout = setTimeout(onTimeout, +TIMEOUT);
            _client = new Client(options);
            client.once(EVENT.CLIENT_READY, onReady);
        });
    }
    get dataManager() {
        return check(__classPrivateFieldGet(this, _dataManager));
    }
    get taskManager() {
        return check(__classPrivateFieldGet(this, _taskManager));
    }
    incrementMaxListener() {
        const maxListeners = this.getMaxListeners();
        if (maxListeners !== 0) {
            this.setMaxListeners(maxListeners + 1);
        }
    }
    decrementMaxListener() {
        const maxListeners = this.getMaxListeners();
        if (maxListeners !== 0) {
            this.setMaxListeners(maxListeners - 1);
        }
    }
    async loadModules(directory) {
        debug(`load client ${directory}`);
        const entries = walkSync(`${$main}/${directory}`, {
            includeBasePath: true,
            directories: false,
            globs: ['**/*.+(ts|js)'],
            ignore: ['test/**/*', '*.__test__.+(ts|js)', '*.test.+(ts|js)']
        });
        for (const Entry of entries) {
            const module = await import(`${Entry}`);
            module.default({ client: this });
        }
    }
    onCommand(regex, module) {
        this.incrementMaxListener();
        this.on(EVENT.MESSAGE_CREATE, message => {
            if (message.guild) { }
        });
    }
}
_modules = new WeakMap(), _dataManager = new WeakMap(), _taskManager = new WeakMap();
const mockInitialise = async () => {
    const mockClient = { shard: null };
    return Promise.resolve(mockClient);
};
const onConnect = (client) => {
    if (client.shard)
        client.shard.send({ type: 'undefined', client });
};
const onFailed = (error) => {
    throw new Error(error);
};
void (async () => {
    if (SHUVI_LAZY_INITIALISE)
        return await mockInitialise();
    return await Client.initialise();
})()
    .then(onConnect)
    .catch(onFailed);
