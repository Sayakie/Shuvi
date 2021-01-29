import { MessageEmbed } from 'discord.js'
import { SYMBOL } from '../../shared/Constants'
import { Category } from '../../structs/Category'
import { Module } from '../../structs/Module'
import { inspect } from 'util'
import type { ModuleOptions } from '../../structs/Module'

type HRTime = ReturnType<NodeJS.HRTime> | null

export class Evaluate extends Module {
  private markTimestamp: HRTime = null
  private doneTimestamp: HRTime = null
  private done = -1

  constructor(options: ModuleOptions) {
    super(options)

    this.aliases = ['eval']
    this.description = 'Evaluates a script from provided, otherwise, fetch from storage.'
    this.category = Category.Owner
    this.botPermissions = ['SEND_MESSAGES']
    this.ownerOnly()
    this.hide()
  }

  async run(): Promise<void> {
    const code = this.args.join(SYMBOL.WHITESPACE)

    this.markTimestamp = process.hrtime()
    let result: unknown
    try {
      const evalInContext = async () =>
        async function (code: string) {
          let evaled = eval(code) as unknown | PromiseConstructorLike
          if (evaled instanceof Promise) {
            evaled = await evaled
          }

          if (typeof evaled === 'object') {
            evaled = inspect(evaled, { depth: 0 })
          }

          return evaled
        }.apply(this.client, [code])

      result = evalInContext()
    } catch (error) {
      result = error
    }
    this.doneTimestamp = process.hrtime(this.markTimestamp)

    const { 0: at, 1: point } = this.doneTimestamp
    this.done = (at * 1e9 + point) / 1e6

    const embed = new MessageEmbed()
      .setTitle(`**${this.message.author.tag}** performs`)
      .setColor(this.message.guild ? this.message.member!.displayColor : 'RANDOM')
      .addField('input', `\`\`\`js\n${code}\n\`\`\``)
      .addField('output', `\`\`\`\n${result as string}\n\`\`\``)
      .setFooter(`PS ${this.done}ms`)
      .setTimestamp()

    await this.message.channel.send(embed, { split: true })
  }
}

export default Evaluate
