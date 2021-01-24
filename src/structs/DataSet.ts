import { SnapDB } from 'snap-db'
import { nanoid } from 'nanoid'

export type DataSetOptions = Exclude<ConstructorParameters<typeof SnapDB>[0], string> & {
  name?: string
}

export const set2 = {
  isLoad: {
    deep: true,
    learning: false
  },
  hi: 0
}

export type DataSetKey<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never
export const a: DataSetKey<{ a: { b: true; c: false } }> = ''

export type set = `get${Capitalize<keyof typeof set2>}`

export class DataSet<T> extends SnapDB<T> {
  public name: string

  constructor(options: DataSetOptions) {
    options = Object.assign(
      {
        key: 'string',
        autoFlush: true,
        cache: true,
        mainThread: false
      },
      options
    )

    super(options, options.key, options.cache)
    this.name = options.name || nanoid(5)
  }
}
