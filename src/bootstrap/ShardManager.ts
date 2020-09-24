import { debug as debugWrapper } from 'debug'
import { ShardingManager } from 'discord.js'
import { join } from 'path'
import { $main } from '../helpers/Path'
import type { ShardManagerOptions } from '../types'

const debug = debugWrapper('Shuvi:Bootstrap')

export class ShardManager extends ShardingManager {
  constructor(mutableOptions: ShardManagerOptions = {}) {
    const isDevelop = process.env.NODE_ENV === 'development'
    const execArgv = [
      '--experimental-modules',
      '--es-module-specifier-resolution=node',
      '--no-warnings',
      '--unhandled-rejections=strict'
    ]
    isDevelop &&
      (execArgv.push(...['-r', 'esm', '-r', 'ts-node/register']),
      debug('MERGE INTO EXECUTES ARGUMENTS'))
    const extension = isDevelop ? 'ts' : 'js'
    const options: ShardManagerOptions = {
      ...{
        file: `${join($main, `Client.${extension}`)}`,
        totalShards: 1,
        mode: 'process',
        execArgv
      },
      ...mutableOptions
    }
    const { file } = options
    super(file!, options)
  }
}
