import { EventEmitter } from 'events'
import { Logger } from '../structures/Logger'
import type { LoggerOptions } from '../types'

export class LogManager extends EventEmitter {
  #adapters: Map<string, Logger>

  constructor() {
    super()

    this.#adapters = new Map<string, Logger>()
  }

  public get adapters(): Map<string, Logger> {
    return this.#adapters
  }

  public create(logOptions: LoggerOptions = {}): Logger {
    const adapter = new Logger(logOptions)
    this.#adapters.set(adapter.name, adapter)
    return adapter
  }

  public get(adapterName: string): Logger | undefined {
    return this.#adapters.get(adapterName)!
  }

  public has(adapterName: string): boolean {
    return this.#adapters.has(adapterName)
  }

  public delete(adapterName: string): boolean {
    return this.#adapters.delete(adapterName)
  }

  public clear(): void {
    this.#adapters.clear()
  }

  public get size(): number {
    return this.#adapters.size
  }
}
