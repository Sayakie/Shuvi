import {
  ActivityOptions,
  Client,
  Constants,
  Message,
  Presence,
  PresenceStatusData
} from 'discord.js'
import walkSync from 'walk-sync'
import { Config } from './config'
import { Command } from './structs/command.Struct'

Config.loadFromFile('./config/.env')
Config.applyToProcess()

const EVENT = Constants.Events

export interface ShuviClient extends Client {
  commands?: Map<string, Command>
}

class Application {
  private static instance: InstanceType<typeof Application>
  public static getInstance(): InstanceType<typeof Application> {
    if (typeof Application.instance === null) {
      Application.instance = new Application()
    }
    return Application.instance
  }

  private client!: ShuviClient
  public readonly setup = async (): Promise<void> => {
    this.client = new Client()
    this.client.commands = new Map<string, Command>()

    await this.client.login(process.env.TOKEN)

    this.loadCommand()
    this.bindEvent()
  }

  public readonly setStatus = async (status: PresenceStatusData): Promise<Presence> => {
    return await this.client.user!.setStatus(status)
  }

  public readonly setActivity = async (
    activity: string,
    options?: ActivityOptions
  ): Promise<Presence> => {
    return await this.client.user!.setActivity(activity, options)
  }

  public readonly getStatus = (): Presence => {
    return this.client.user!.presence
  }

  public readonly getActivity = (): Presence => {
    return this.client.user!.presence
  }

  public readonly getPresence = (): Presence => {
    return this.client.user!.presence
  }

  private readonly onMessage = async (message: Message): Promise<void> => {
    if (message.cleanContent.indexOf(process.env.prefix!) !== 0) return

    const args = message.cleanContent.slice(process.env.prefix!.length).trim().split(/\s+/g)
    const commandName = args.shift()!.toLowerCase()

    if (!this.client.commands?.has(commandName)) {
      await message.author.send('zz')
    }

    try {
      await this.client.commands!.get(commandName)!.inject(message, args).run()
    } catch (err) {
      await message.channel.send('There was an error while try to run that command!')
    }
  }

  private readonly loadCommand = (): void => {
    const files = walkSync('./commands').filter(
      file => !(file.includes('Command') && (file.endsWith('js') || file.endsWith('ts')))
    )

    files.forEach(file => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
      const RunnableCommand = (require(file).default as unknown) as Command

      RunnableCommand.initialise(this.client)
      RunnableCommand.aliases.unshift(RunnableCommand.name)
      RunnableCommand.aliases.map(ally => this.client.commands!.set(ally, RunnableCommand))
    })
  }

  private readonly bindEvent = (): void => {
    this.client.on(EVENT.CLIENT_READY, () => {
      console.log('ready')
    })
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.client.on(EVENT.MESSAGE_CREATE, this.onMessage)
  }
}

export { Application }
