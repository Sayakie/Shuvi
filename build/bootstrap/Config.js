import { config } from 'dotenv';
import { $root } from '../helpers/Path';
export class Config {
    constructor() {
        throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
    }
    static async parse(path = `${$root}/.env`) {
        return new Promise((resolve, reject) => {
            const env = config({ path, encoding: 'utf-8' });
            if (env.error)
                reject(env.error);
            else
                resolve(env.parsed);
        });
    }
}
