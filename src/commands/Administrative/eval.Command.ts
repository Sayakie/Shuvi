import { Command } from '../../structs/command.Struct'

class Eval extends Command {
  constructor() {
    super()
    this.name = 'eval'
    this.aliases = []
  }

  public run(): void {
    eval(this.args.join(' ')!)
  }
}

export default new Eval()
