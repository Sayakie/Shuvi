import {
  ActivityOptions,
  Client,
  Constants,
  Message,
  Presence,
  PresenceStatusData,
  PresenceStatus,
  Activity,
  PartialMessage,
  Collection
} from 'discord.js'
import walkSync from 'walk-sync'
import { Command } from './structs/command.Struct'

const EVENT = Constants.Events

export interface ShuviClient extends Client {
  commands?: Collection<string, Command>
}

class Application {
  private static instance: Application = new Application()
  public static getInstance(): Application {
    return Application.instance
  }

  private client!: ShuviClient
  private cache = new Collection<number, number>()
  public readonly setup = async (): Promise<void> => {
    this.client = new Client({
      messageCacheMaxSize: 1 << 7,
      messageCacheLifetime: 1 << 13,
      messageSweepInterval: 1 << 6
    })
    this.client.commands = new Collection<string, Command>()

    this.loadCommand()
    this.bindEvent()
    await this.login()
  }

  private readonly login = async (): Promise<string> =>
    await this.client.login(process.env.DISCORD_BOT_TOKEN)

  public readonly setStatus = async (status: PresenceStatusData): Promise<Presence> => {
    return await this.client.user!.setStatus(status)
  }

  public readonly setActivity = async (
    activity: string,
    options?: ActivityOptions
  ): Promise<Presence> => {
    return await this.client.user!.setActivity(activity, options)
  }

  public readonly getStatus = (): PresenceStatus => this.client.user!.presence.status
  public readonly getActivity = (): Activity => this.client.user!.presence.activities[0]
  public readonly getActivities = (): Activity[] => this.client.user!.presence.activities
  public readonly getPresence = (): Presence => this.client.user!.presence
  public readonly getClient = (): ShuviClient => this.client

  private readonly onMessage = async (message: Message): Promise<void> => {
    if (!message.cleanContent.startsWith(process.env.DISCORD_PREFIX!) || message.system) return

    const args = message.cleanContent.slice(process.env.DISCORD_PREFIX!.length).trim().split(/\s+/g)
    const commandName = args.shift()!.toLowerCase()

    if (!this.client.commands?.has(commandName)) {
      await message.author.send('명령어를 찾을 수 없습니다!')
    }

    try {
      await this.client.commands!.get(commandName)!.inject(message, args).run()
    } catch (err) {
      await message.channel.send('There was an error while try to run that command!')
    } finally {
      // TODO: second parameter to set of user's message id
      this.cache.set(+message.id, 1)
    }
  }

  private readonly onMessageUpdate = async (
    _: Message | PartialMessage,
    nextMessage: Message | PartialMessage
  ): Promise<void> => {
    await this.onMessage(nextMessage as Message)
  }

  private readonly loadCommand = (): void => {
    const files = walkSync(`${__dirname}/commands`, { directories: false }).filter(
      file => file.includes('Command') && (file.endsWith('js') || file.endsWith('ts'))
    )

    files.forEach(file => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
      const RunnableCommand = (require(`${__dirname}/commands/${file}`)
        .default as unknown) as Command

      RunnableCommand.initialise(Application.getInstance())
      RunnableCommand.aliases.unshift(RunnableCommand.name)
      RunnableCommand.aliases.map(ally => this.client.commands!.set(ally, RunnableCommand))
    })
  }

  private readonly bindEvent = (): void => {
    this.client.on(EVENT.CLIENT_READY, () => {
      console.log('ready')
    })
    this.client.on(EVENT.DISCONNECT, () => {
      console.log('disconnecting...')
    })
    /* eslint-disable @typescript-eslint/no-misused-promises */
    this.client.on(EVENT.MESSAGE_CREATE, this.onMessage)
    this.client.on(EVENT.MESSAGE_UPDATE, this.onMessageUpdate)
    this.client.on(EVENT.WARN, console.warn)
    this.client.on(EVENT.ERROR, console.error)
    this.client.on(EVENT.DEBUG, console.debug)
    /* eslint-enable */
  }
}

export { Application }
