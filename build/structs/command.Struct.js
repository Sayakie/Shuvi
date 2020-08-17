"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
class Command {
    constructor() {
        this.args = [];
        this.aliases = [];
        return this;
    }
    initialise(Client) {
        this.client = Client;
    }
    inject(message, args) {
        this.message = message;
        this.args = args;
        return this;
    }
    run() {
        throw new Error(`${this.constructor.name} command does not have a run() method.`);
    }
}
exports.Command = Command;
