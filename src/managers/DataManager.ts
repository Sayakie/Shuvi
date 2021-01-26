import { nanoid } from 'nanoid'
import { Collection } from 'discord.js'
import { DataSet } from '../structs/DataSet'
import type { Client } from '../App'
import type { DataSetOptions } from '../structs/DataSet'

export type DataManagerOptions = {
  client: Client
}

export class DataManager {
  public client: Client
  public guilds: DataSet<string>

  #datasets: Collection<string, DataSet<unknown>>

  constructor(options: DataManagerOptions) {
    const { client } = options

    this.client = client
    this.#datasets = new Collection()
    this.guilds = this.create({ dir: 'data/guilds' })
  }

  static createOptions: DataSetOptions = {
    dir: nanoid(5)
  }

  public create<T>(options?: DataSetOptions): DataSet<T> {
    const DB = new DataSet<T>(options || DataManager.createOptions)
    this.#datasets.set(DB.name, DB)

    return DB
  }

  public find<T extends unknown>(name: string): DataSet<T> | null {
    const keys = this.#datasets.keys()
    // eslint-disable-next-line no-loops/no-loops
    while (!keys.next().done) {
      const dataset = keys.next().value as DataSet<T>

      if (dataset.name === name) {
        return dataset
      }
    }

    return null
  }

  public toString(): string {
    return `DataManager {size=${this.#datasets.size}}`
  }
}
