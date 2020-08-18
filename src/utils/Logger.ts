import winston, { createLogger, format, transports } from 'winston'
import { ConsoleTransportOptions, FileTransportOptions } from 'winston/lib/winston/transports'

type loggerOptions = {
  file: FileTransportOptions
  console: ConsoleTransportOptions
}

const { combine, timestamp, label, printf } = format
const logFormat = printf(
  ({ level, message, label, timestamp }) =>
    `${timestamp as string} [${label as string}] ${level}: ${message}`
)

const options: loggerOptions = {
  file: {
    level: 'info',
    filename: `${process.cwd()}/logs/`,
    handleExceptions: true,
    maxsize: 5 * 1024 * 1024,
    maxFiles: 5,
    format: combine(label({ label: 'App' }), timestamp(), logFormat)
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    format: combine(label({ label: 'App' }), timestamp(), logFormat)
  }
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const logger = new createLogger({
  transports: [winston.transports.File(options.file)],
  exitOnError: false
})

process.env.NODE_ENV !== 'production' && logger.add(new transports.Console(options.console))
