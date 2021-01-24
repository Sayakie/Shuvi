import { SnowflakeUtil } from 'discord.js'
import type { Snowflake } from '../types'

export type TaskOptions = {
  name?: string
  description?: string
  timeout: number
}

export class Task {
  #id: Snowflake
  #name: string | Snowflake
  isActive: boolean
  description: string

  constructor(options: TaskOptions) {
    this.#id = SnowflakeUtil.generate() as Snowflake

    const { name, description } = options
    this.#name = name || this.#id
    this.isActive = true
    this.description = description || 'No description provided.'
  }

  get name(): string {
    return this.#name
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

  activate(): boolean {
    // TODO : do more something setup
    return (this.isActive = !this.isActive)
  }

  deactivate(): boolean {
    // TODO : do more something cleanup
    return (this.isActive = !this.isActive)
  }

  valueOf(): number {
    return Number(this.id)
  }

  toString(): string {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `Task {${this.name} - ${this.description}}[isActive=${this.isActive}]`
  }
}
