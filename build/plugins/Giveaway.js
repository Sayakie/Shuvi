import { EVENT } from '../helpers/Constants';
export default ({ client }) => {
    client.incrementMaxListener();
    client.on(EVENT.MESSAGE_CREATE, message => { });
};
