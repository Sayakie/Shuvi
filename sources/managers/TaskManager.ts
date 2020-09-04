import { BaseClient as BaseManager } from 'discord.js'
import { EVENT } from '../config/Constants'
import { Task } from '../structures/Task'
import type { TaskOptions } from '../types'

export class TaskManager extends BaseManager {
  private tasks: Map<string, Task>
  constructor() {
    super()

    this.tasks = new Map<string, Task>()
  }

  public async create(taskOptions?: TaskOptions): Promise<Task> {
    const field = Object.assign({ name: `Task ${this.tasks.size + 1}` }, taskOptions)

    if (this.tasks.has(field.name)) return Promise.resolve(this.tasks.get(field.name)!)

    return new Promise((resolve, reject) => {
      try {
        const task = new Task(field)
        this.tasks.set(task.name, task)
        this.emit(EVENT.TASK_CREATE, task)

        resolve(task)
      } catch (error) {
        reject(error)
      }
    })
  }

  public delete(taskName: string): boolean {
    const task = this.tasks.get(taskName)!
    task.timeouts!.forEach(timer => this.clearTimeout(timer))
    this.emit(EVENT.TASK_DELETE, task)
    return this.tasks.delete(taskName)
  }
}
