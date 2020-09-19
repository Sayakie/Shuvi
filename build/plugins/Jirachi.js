import { EVENT } from '../helpers/Constants';
export default async ({ client }) => {
    return new Promise((resolve, reject) => {
        client.incrementMaxListener();
        client.on(EVENT.MESSAGE_CREATE, message => {
            if (!message.guild)
                return;
            if (message.cleanContent.includes('지라치') ||
                message.cleanContent.toLowerCase().includes('jirachi') ||
                message.cleanContent.includes('ジラーチ')) {
                message.react('754276749705084999');
                console.log(`{Jirachi} ${message.author.tag} > ${message.cleanContent}`);
                resolve();
            }
            else {
                reject(new Error('do'));
            }
        });
    });
};