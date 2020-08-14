import { Command } from 'structs/command.Struct'

class Eval extends Command {
  constructor() {
    super()
    this.name = 'eval'
    this.aliases = []
  }

  public async run(): Promise<void> {
    const result = (eval(this.args.join(' ')!) as unknown) as string

    await this.message.author.send(result)
  }
}

export default Eval
