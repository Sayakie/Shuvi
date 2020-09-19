import { BaseManager } from './BaseManager'
import { Task } from '../structs/Task'
import type { TaskOptions, Timestamp } from '../types'

export class TaskManager extends BaseManager {
  #tasks: Map<string, Task>

  constructor() {
    super()

    this.#tasks = new Map<string, Task>()
  }

  get tasks(): Map<string, Task> {
    return this.#tasks
  }

  get size(): number {
    let activeTasks = 0

    // eslint-disable-next-line no-loops/no-loops
    for (const task of this.#tasks.values()) {
      if (task.active) activeTasks++
    }

    return activeTasks
  }

  set(options: TaskOptions): Task {
    const taskOptions = { ...({ timeout: 5500 as Timestamp } as TaskOptions), ...options }
    const task = new Task(taskOptions)

    return task
  }

  clear(): void {
    this.destroy()
    this.#tasks.clear()
  }
}
