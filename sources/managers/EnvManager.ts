import { EventEmitter } from 'events'
import { Collection } from 'discord.js'

type envInput = string
type envInputs = envInput | envInput[] | undefined
type envOutput = unknown
type envOutputs = envOutput | envOutput[] | undefined

export class EnvManager extends EventEmitter {
  #env: Collection<envInput, envOutput>

  constructor() {
    super()

    this.#env = new Collection()
  }

  public get size(): number {
    return this.#env.size
  }

  public get(key: envInput): envOutput | undefined {
    if (this.#env.has(key)) {
      return this.#env.get(key)
    }

    return undefined
  }

  public set(key: envInput, value: envOutput): ThisType<Collection<envInput, envOutput>> {
    return this.#env.set(key, value)
  }

  public has(key: envInput): boolean {
    return this.#env.has(key)
  }

  public delete(key: envInput): boolean {
    return this.#env.delete(key)
  }

  public clear(): void {
    this.#env.clear()
  }

  public array(): envOutput[] {
    return this.#env.array()
  }

  public keyArray(): envInput[] {
    return this.#env.keyArray()
  }

  public first(amount?: number): envOutputs {
    if (this.size === 0) return undefined
    if (amount) return this.#env.first(amount)
    return this.#env.first()
  }

  public firstKey(amount?: number): envInputs {
    if (this.size === 0) return undefined
    if (amount) return this.#env.firstKey(amount)
    return this.#env.firstKey()
  }

  public last(amount?: number): envOutputs {
    if (this.size === 0) return undefined
    if (amount) return this.#env.last(amount)
    return this.#env.last()
  }

  public lastKey(amount?: number): envInputs {
    if (this.size === 0) return undefined
    if (amount) return this.#env.lastKey(amount)
    return this.#env.lastKey()
  }

  public random(amount?: number): NonNullable<envOutputs> {
    if (amount) return this.#env.random(amount)
    return this.#env.random()
  }

  public randomKey(amount?: number): NonNullable<envInputs> {
    if (amount) return this.#env.randomKey(amount)
    return this.#env.randomKey()
  }

  public find()

  public toJSON(): Record<envInput, envOutput> {
    return (this.#env.toJSON() as unknown) as Record<envInput, envOutput>
  }
}
