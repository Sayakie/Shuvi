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
var _tasks;
import { BaseManager } from './BaseManager';
import { Task } from '../structs/Task';
export class TaskManager extends BaseManager {
    constructor() {
        super();
        _tasks.set(this, void 0);
        __classPrivateFieldSet(this, _tasks, new Map());
    }
    get tasks() {
        return __classPrivateFieldGet(this, _tasks);
    }
    get size() {
        let activeTasks = 0;
        for (const task of __classPrivateFieldGet(this, _tasks).values()) {
            if (task.active)
                activeTasks++;
        }
        return activeTasks;
    }
    set(options) {
        const taskOptions = { ...{ timeout: 5500 }, ...options };
        const task = new Task(taskOptions);
        return task;
    }
    clear() {
        this.destroy();
        __classPrivateFieldGet(this, _tasks).clear();
    }
}
_tasks = new WeakMap();
