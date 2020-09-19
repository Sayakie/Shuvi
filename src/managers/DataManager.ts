import Enmap from 'enmap'
import type { DataID, DataOptions } from '../types'

export class DataManager {
  #data: Map<DataID, Enmap<string, unknown>>

  constructor() {
    this.#data = new Map<DataID, Enmap<string, unknown>>()
  }

  create<T>(options?: DataOptions): Enmap<string, T> {
    const dataOptions = {
      ...({
        name: `Data ${this.#data.size + 1}`,
        fetchAll: false,
        autoFetch: true,
        cloneLevel: 'deep'
      } as DataOptions),
      ...options
    }

    const { name } = dataOptions
    if (this.#data.has(name)) return this.#data.get(name)! as Enmap<string, T>

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const data = new Enmap(dataOptions) as Enmap<string, T>
    this.#data.set(name, data as Enmap<string, unknown>)

    return data
  }
}
