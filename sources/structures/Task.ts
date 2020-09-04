import { SnowflakeUtil } from 'discord.js'
import type { Snowflake, TaskOptions } from '../types'

export class Task {
  private readonly _id: Snowflake
  private _name: string
  private readonly description: string
  public readonly timeouts?: NodeJS.Timeout[]

  constructor({ name, description }: TaskOptions) {
    this._id = SnowflakeUtil.generate() as Snowflake
    this._name = name
    this.description = description || 'No description'
  }

  public get id(): Snowflake {
    return this._id
  }

  public get createdTimestamp(): number {
    return SnowflakeUtil.deconstruct(this.id).timestamp
  }

  public get createdAt(): Date {
    return new Date(this.createdTimestamp)
  }

  public set name(taskName: string) {
    this._name = taskName
  }

  public get name(): string {
    return this._name
  }

  public toString(): string {
    return `{Task ${this.name}: ${this.description}}`
  }

  public valueOf(): Snowflake {
    return this.id
  }
}
