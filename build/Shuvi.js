"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const discord_js_1 = require("discord.js");
const walk_sync_1 = __importDefault(require("walk-sync"));
const config_1 = require("./config");
config_1.Config.loadFromFile('./config/.env');
config_1.Config.applyToProcess();
const EVENT = discord_js_1.Constants.Events;
class Application {
    constructor() {
        this.setup = async () => {
            this.client = new discord_js_1.Client();
            this.client.commands = new Map();
            await this.client.login(process.env.DISCORD_BOT_TOKEN);
            this.loadCommand();
            this.bindEvent();
        };
        this.setStatus = async (status) => {
            return await this.client.user.setStatus(status);
        };
        this.setActivity = async (activity, options) => {
            return await this.client.user.setActivity(activity, options);
        };
        this.getStatus = () => {
            return this.client.user.presence.status;
        };
        this.getActivity = () => {
            return this.client.user.presence.activities[0];
        };
        this.getActivities = () => {
            return this.client.user.presence.activities;
        };
        this.getPresence = () => {
            return this.client.user.presence;
        };
        this.onMessage = async (message) => {
            if (message.cleanContent.indexOf(process.env.prefix) !== 0)
                return;
            const args = message.cleanContent.slice(process.env.prefix.length).trim().split(/\s+/g);
            const commandName = args.shift().toLowerCase();
            if (!this.client.commands?.has(commandName)) {
                await message.author.send('zz');
            }
            try {
                await this.client.commands.get(commandName).inject(message, args).run();
            }
            catch (err) {
                await message.channel.send('There was an error while try to run that command!');
            }
        };
        this.loadCommand = () => {
            const files = walk_sync_1.default('./commands').filter(file => !(file.includes('Command') && (file.endsWith('js') || file.endsWith('ts'))));
            files.forEach(file => {
                const RunnableCommand = require(file).default;
                RunnableCommand.initialise(this.client);
                RunnableCommand.aliases.unshift(RunnableCommand.name);
                RunnableCommand.aliases.map(ally => this.client.commands.set(ally, RunnableCommand));
            });
        };
        this.bindEvent = () => {
            this.client.on(EVENT.CLIENT_READY, () => {
                console.log('ready');
            });
            this.client.on(EVENT.MESSAGE_CREATE, this.onMessage);
        };
    }
    static getInstance() {
        if (typeof Application.instance === null) {
            Application.instance = new Application();
        }
        return Application.instance;
    }
}
exports.Application = Application;
