import { Measure } from 'utils/Measure'
import { Command } from '../../structs/command.Struct'
import { Permission } from '../../structs/permission.Struct'

class Eval extends Command {
  public name: string
  public aliases: string[]

  constructor() {
    super()
    this.name = 'eval'
    this.aliases = []
    this.usage = '{0}eval <Javascript Code>'
    this.description = 'Execute javascript code'
    this.botPermissions = [Permission.ADMINISTRATOR]
    this.userPermissions = [Permission.ADMINISTRATOR]
    this.noDetails()
    this.ownerOnly()
    this.hide()
  }

  public async run(): Promise<void> {
    const [result, period] = await Measure.test('eval', eval(this.args.join(' ')))

    await this.message.channel.send({ result, period })
  }
}

export default new Eval()
