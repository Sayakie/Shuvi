import { Application } from './App'
import { Config } from './config'
import { EVENT, LOGGER } from './config/Constants'
import { $config } from './config/PathFinder'

void (async () => {
  await Config.loadFromFile(`${$config}/.env`)
  await Config.applyToProcess()
  await Application.instance.bootstrap()
  // Application.logManager.create({ name: LOGGER.CORE })
  Application.instance.client.removeAllListeners()
  Application.instance.client.on(EVENT.MESSAGE_CREATE, _ => {
    /** */
  })
})().catch(Application.logManager.get(LOGGER.CORE)!.error || console.error)
