import { nanoid } from 'nanoid'

export class Dispatcher {
  public name: string

  constructor() {
    this.name = nanoid(5)
  }
}
