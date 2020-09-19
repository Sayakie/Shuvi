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
var _id, _name;
import { SnowflakeUtil } from 'discord.js';
export class Task {
    constructor(options) {
        _id.set(this, void 0);
        _name.set(this, void 0);
        __classPrivateFieldSet(this, _id, SnowflakeUtil.generate());
        const { name, description } = options;
        __classPrivateFieldSet(this, _name, name || __classPrivateFieldGet(this, _id));
        this.description = description || 'No description provided.';
    }
    get id() {
        return __classPrivateFieldGet(this, _id);
    }
    get createdTimestamp() {
        return SnowflakeUtil.deconstruct(this.id).timestamp;
    }
    get createdAt() {
        return new Date(this.createdTimestamp);
    }
    get name() {
        return __classPrivateFieldGet(this, _name);
    }
    get active() {
        return true;
    }
    toString() {
        return `Task {${__classPrivateFieldGet(this, _name)} - ${this.description}}`;
    }
}
_id = new WeakMap(), _name = new WeakMap();
