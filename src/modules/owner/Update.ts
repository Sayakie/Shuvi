import { MessageEmbed } from 'discord.js'
import { SYMBOL } from '../../helpers/Constants'
import { Category } from '../../structs/Category'
import { Module } from '../../structs/Module'
import type { ModuleOptions } from '../../types'

export class Update extends Module {
  public name: string

  constructor({ client }: ModuleOptions) {
    super({ client })

    this.name = 'Update'
    this.aliases = ['upgrade']
    this.description = 'up to date from repository'
    this.details =
      'Compares local version with remote version, downloads and ups to date from if did not match.'
    this.category = Category.Owner
    this.ownerOnly()
    this.hide()
  }

  async run(): Promise<void> {
    const code = this.args.join(SYMBOL.WHITESPACE)

    let result: unknown
    try {
      const evalInContext = (): unknown => eval(code)
      // result = eval.bind({ ...this.client })(code)
      result = evalInContext.call(this.client)
    } catch (error) {
      result = error
    }

    const embed = new MessageEmbed()
      .setColor(this.message.guild ? this.message.member!.displayColor : '#0099CC')
      .addField('input', `\`\`\`js\n${code}\n\`\`\``)
      .addField('output', `\`\`\`js\n${result as string}\n\`\`\``)

    await this.message.channel.send(embed)
  }
}

export default Update
