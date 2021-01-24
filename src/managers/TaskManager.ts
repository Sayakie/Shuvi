import { Collection } from 'discord.js'
import { Client } from '../App'
import { Task } from '../structs/Task'

export type TaskManagerOptions = {
  client: Client
}

export class TaskManager {
  public client: Client

  #tasks: Collection<string, Task>

  constructor(options: TaskManagerOptions) {
    const { client } = options

    this.client = client
    this.#tasks = new Collection()
  }

  get tasks(): Map<string, Task> {
    return this.#tasks
  }

  get size(): number {
    let activeTasks = 0

    if (this.#tasks.size === 0) return activeTasks

    // eslint-disable-next-line no-loops/no-loops
    for (const task of this.#tasks.values()) {
      if (task.isActive) activeTasks++
    }

    return activeTasks
  }

  public toString(): string {
    return `TaskManager {size=${this.size}}`
  }
}
