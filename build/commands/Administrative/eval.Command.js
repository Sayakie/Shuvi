"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_Struct_1 = require("structs/command.Struct");
class Eval extends command_Struct_1.Command {
    constructor() {
        super();
        this.name = 'eval';
        this.aliases = [];
    }
    async run() {
        const result = eval(this.args.join(' '));
        await this.message.author.send(result);
    }
}
exports.default = Eval;
