import { MessageEmbed } from 'discord.js'
import { SYMBOL } from '../../helpers/Constants'
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

  async run(): Promise<void> {
    const code = this.args.join(SYMBOL.NOT_EXISTS)

    let result: unknown
    try {
      const makeClientScope = (code: string): string =>
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        Function(`use strict; ${eval(code)}`).call(this.client) as string

      result = makeClientScope(code)
    } catch (error) {
      result = error
    }

    const embed = new MessageEmbed()
      .setColor(this.message.guild ? this.message.member!.roles.highest.color : '#0099CC')
      .addField('input', `\`\`\`js\n${code}\n\`\`\``)
      .addField('output', `\`\`\`js\n${result as string}\n\`\`\``)

    await this.message.channel.send(embed)
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
