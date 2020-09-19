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
var _data;
import Enmap from 'enmap';
export class DataManager {
    constructor() {
        _data.set(this, void 0);
        __classPrivateFieldSet(this, _data, new Map());
    }
    create(options) {
        const dataOptions = {
            ...{
                name: `Task ${__classPrivateFieldGet(this, _data).size + 1}`,
                fetchAll: false,
                autoFetch: true,
                cloneLevel: 'deep'
            },
            ...options
        };
        const { name } = dataOptions;
        if (__classPrivateFieldGet(this, _data).has(name))
            return __classPrivateFieldGet(this, _data).get(name);
        const data = new Enmap(dataOptions);
        __classPrivateFieldGet(this, _data).set(name, data);
        return data;
    }
}
_data = new WeakMap();
