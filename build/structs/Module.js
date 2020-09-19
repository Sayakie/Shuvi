var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _guildOnly, _ownerOnly, _nsfwOnly, _hidden;
export class Module {
    constructor({ client }) {
        this.active = false;
        this.name = Module.toString();
        this.aliases = [];
        this.description = 'No description provided.';
        this.details = 'No details provided.';
        this.usage = 'No usage provided.';
        this.category = "Uncategorized";
        this.botPermissions = [];
        this.userPermissions = [];
        _guildOnly.set(this, false);
        _ownerOnly.set(this, false);
        _nsfwOnly.set(this, false);
        _hidden.set(this, false);
        this.active = true;
        this.client = client;
    }
    get isGuildOnly() {
        return __classPrivateFieldGet(this, _guildOnly);
    }
    get isOwnerOnly() {
        return __classPrivateFieldGet(this, _ownerOnly);
    }
    get isNsfwOnly() {
        return __classPrivateFieldGet(this, _nsfwOnly);
    }
    get isHidden() {
        return __classPrivateFieldGet(this, _hidden);
    }
    guildOnly() {
        __classPrivateFieldSet(this, _guildOnly, true);
    }
    ownerOnly() {
        __classPrivateFieldSet(this, _ownerOnly, true);
    }
    nsfwOnly() {
        __classPrivateFieldSet(this, _nsfwOnly, true);
    }
    hide() {
        __classPrivateFieldSet(this, _hidden, true);
    }
    inject(message, args) {
        this.message = message;
        this.args = args;
        return this;
    }
    run() {
        throw new Error(`${this.toString()} did not set up a run() method.`);
    }
    detach() {
        this.client.decrementMaxListener();
    }
    toString() {
        return `Module {${this.constructor.name}}`;
    }
}
_guildOnly = new WeakMap(), _ownerOnly = new WeakMap(), _nsfwOnly = new WeakMap(), _hidden = new WeakMap();
