import type Debug from 'debug'

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-call
const debug = require('debug')('Core') as Debug.Debugger

; (['SIGINT', 'SIGHUP'] as NodeJS.Signals[]).forEach(signal => {
  process.on(signal, () => {
    debug('Destroy all shards.')
  })
})
