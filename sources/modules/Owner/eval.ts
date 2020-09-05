import { Category } from '../../structures/Category'
import { Module } from '../../structures/Module'
import type { ModuleOptions } from '../../types'

export class eval extends Module {
  public name: string
  public aliases: string[]
  public description: string | undefined
  public details: string | undefined
  public usage: string | undefined
  public category: Category = Category.Owner
  public botPermissions: number[] = []
  public userPermissions: number[] = []

  constructor(options: ModuleOptions) {
    super(options)

    this.name = 'Eval'
    this.aliases = []
  }
}
