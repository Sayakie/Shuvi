import { SnowflakeUtil } from 'discord.js'
import type { Snowflake, TaskOptions, TaskUniqueName } from '../types'

export class Task {
  #id: Snowflake
  #name: TaskUniqueName | Snowflake
  description: string

  constructor(options: TaskOptions) {
    this.#id = SnowflakeUtil.generate() as Snowflake

    const { name, description } = options
    this.#name = name || this.#id
    this.description = description || 'No description provided.'
  }

  get id(): Snowflake {
    return this.#id
  }

  get createdTimestamp(): number {
    return SnowflakeUtil.deconstruct(this.id).timestamp
  }

  get createdAt(): Date {
    return new Date(this.createdTimestamp)
  }

  get name(): TaskUniqueName {
    return this.#name as TaskUniqueName
  }

  get active(): boolean {
    return true
  }

  toString(): string {
    return `Task {${this.#name} - ${this.description}}`
  }
}
