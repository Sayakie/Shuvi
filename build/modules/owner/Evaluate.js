import { EVENT } from '../../helpers/Constants';
import { Module } from '../../structs/Module';
export class Evaluate extends Module {
    constructor({ client }) {
        super({ client });
        this.name = 'Evaluate';
        this.aliases = ['eval'];
        this.description = 'Evaluates a script from provided, otherwise, fetch from storage.';
        this.category = "Owner";
        this.client.incrementMaxListener();
        this.client.on(EVENT.MESSAGE_CREATE, message => {
            console.log(`[${message.channel.id}] ${message.author.tag} > ${message.cleanContent}`);
            if (!message.guild)
                return;
            if (message.cleanContent.includes('지라치') ||
                message.cleanContent.toLowerCase().includes('jirachi') ||
                message.cleanContent.includes('ジラーチ')) {
                message.react('754276749705084999');
            }
        });
    }
}
export default async ({ client }) => {
    return new Promise((resolve, reject) => {
        try {
            const Module = new Evaluate({ client });
            resolve(Module);
        }
        catch (error) {
            reject(error);
        }
    });
};
