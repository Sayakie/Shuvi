import { EVENT } from '../helpers/Constants'
import type { ModuleOptions } from '../types'

export default ( { client }: ModuleOptions ): void => {
  client.incrementMaxListener()
  client.on(EVENT.MESSAGE_CREATE, message => {})
 }

 /**
  * /글로벌
  * /야생
  * /월드
  * /투토리얼
  */
