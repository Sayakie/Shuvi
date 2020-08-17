import { Application } from './Shuvi'
import { Config } from './config'

Config.loadFromFile(`${process.cwd()}/.env`)
Config.applyToProcess()

process.on('SIGINT', () => {
  Application.getInstance().getClient().destroy()
})

process.on('unhandledRejection', console.error)
process.on('uncaughtException', console.error)

void (async () => Application.getInstance().setup())()
