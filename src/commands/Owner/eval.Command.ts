import { Command } from '../../structs/command.Struct'

class Eval extends Command {
  public name: string
  public aliases: string[]

  constructor() {
    super()
    this.name = 'eval'
    this.aliases = []
    this.usage = '{0}eval <Javascript Code>'
    this.description = 'Execute javascript code'
    this.noDetails()
    this.hide()
  }

  public run(): void {
    eval(this.args.join(' '))
  }
}

export default new Eval()
