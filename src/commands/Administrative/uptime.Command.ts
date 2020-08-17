import { Command } from '../../structs/command.Struct'
import { MessageEmbed } from 'discord.js'

class Eval extends Command {
  public name: string
  public aliases: string[]

  constructor() {
    super()
    this.name = 'uptime'
    this.aliases = []
    this.usage = '{0}uptime'
    this.description = 'Time since the bot was turned on.'
    this.noDetails()
    this.hide()
  }

  private getDuration(ms: number) {
    const seconds = (~~((ms / 1000) % 60)).toString()
    const minutes = (~~((ms / (1000 * 60)) % 60)).toString()
    const hours = (~~((ms / (1000 * 60 * 60)) % 60)).toString()
    const days = (~~((ms / (1000 * 60 * 60 * 24)) % 60)).toString()
    return `${days.padStart(1, '0')} days, ${hours.padStart(2, '0')} hours, ${minutes.padStart(
      2,
      '0'
    )} minutes, ${seconds.padStart(2, '0')} seconds`
  }

  public async run(): Promise<void> {
    const embedBlock = new MessageEmbed()
      .setColor('#0099cc')
      .setAuthor('🔌 Uptime', '', 'https://github.com/Sayakie/Shuvi')
      .setDescription(this.getDuration(this.instance.getClient().uptime!))

    await this.message.channel.send(embedBlock)
  }
}

export default new Eval()
