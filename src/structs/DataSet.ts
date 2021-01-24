import { SnapDB } from 'snap-db'
import { nanoid } from 'nanoid'

export type DataSetOptions = Exclude<ConstructorParameters<typeof SnapDB>[0], string> & {
  name?: string
}

export class DataSet<T> extends SnapDB<T> {
  public name: string
  public dir: string

  constructor(options?: DataSetOptions) {
    options = {
      ...{
        dir: nanoid(5),
        key: 'string',
        autoFlush: true,
        cache: true,
        mainThread: false
      },
      ...options
    }
    const dir = options.dir
    options.dir = `data/${options.dir}`

    super(options, options.key, options.cache)
    this.name = options.name || dir
    this.dir = dir
  }

  toString(): string {
    return `DataSet {name=${this.name}, dir=${this.dir}}`
  }
}
