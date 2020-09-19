import { EVENT } from '../../helpers/Constants'
import { Category } from '../../structs/Category'
import { Module } from '../../structs/Module'
import type { ModuleOptions } from '../../types'

export class Evaluate extends Module {
  public name: string

  constructor({ client }: ModuleOptions) {
    super({ client })

    this.name = 'Evaluate'
    this.aliases = ['eval']
    this.description = 'Evaluates a script from provided, otherwise, fetch from storage.'
    this.category = Category.Owner
    this.ownerOnly()
    this.hide()
  }
}

export default async ({ client }: ModuleOptions): Promise<Module> => {
  return new Promise((resolve, reject) => {
    try {
      const Module = new Evaluate({ client })
      resolve(Module)
    } catch (error) {
      reject(error)
    }
  })
}
