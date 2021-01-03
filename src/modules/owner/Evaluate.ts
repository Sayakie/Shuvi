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
    this.botPermissions = ['SEND_MESSAGES']
    this.ownerOnly()
    this.hide()
  }

  async run(): Promise<void> {
    const code = this.args.join(SYMBOL.WHITESPACE)

    let result: unknown
    try {
      const evalInContext = () =>
        function (code: string) {
          return eval(code) as unknown
        }.apply(this.client, [code])

      result = evalInContext()
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

export default Evaluate
