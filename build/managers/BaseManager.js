import { BaseClient, Util } from 'discord.js';
export class BaseManager extends BaseClient {
    toString() {
        return `${this.constructor.name} {${Util.flatten(this)}}`;
    }
}
