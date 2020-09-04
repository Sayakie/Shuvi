import { Application } from './App'
import { Config } from './config'
import { $config } from './managers/PathFinder'

void (async () => {
  await Config.loadFromFile(`${$config}/.env`)
  await Config.applyToProcess()
  await Application.instance.bootstrap()
})
