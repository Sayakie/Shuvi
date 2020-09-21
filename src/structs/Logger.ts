import { createLogger, format, transports } from 'winston'
import type { Logger as WinstonLogger } from 'winston'
import type { LoggerOptions, Opaque } from '../types'

const { printf } = format
const ConsoleFormat = printf(
  ({ timestamp, level, message, service }) => `${timestamp} ${level}: [${service}] ${message}`
)

export class Logger {
  #instance: WinstonLogger
  #name: Opaque<string, 'Logger'>

  public get instance(): WinstonLogger {
    return this.#instance
  }
  public get name(): string {
    return this.#name
  }

  constructor(options: LoggerOptions) {
    options = Object.assign(
      {
        name: 'Shuvi',
        level: 'info',
        format: format.combine(
          format.prettyPrint(),
          format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss' }),
          format.errors({ stack: true }),
          format.splat(),
          format.json({ space: 2 })
        ),
        defaultMeta: { service: options.name },
        transports: [
          new transports.File({
            filename: 'logs/error.log',
            level: 'error',
            handleExceptions: true
          }),
          new transports.File({ filename: 'logs/combined.log' }),
          process.env.NODE_ENV !== 'production' &&
            new transports.Console({
              format: format.combine(
                // format.prettyPrint(),
                format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss' }),
                format.colorize(),
                ConsoleFormat
              ),
              handleExceptions: true
            })
        ].filter(Boolean),
        exitOnError: false
      } as LoggerOptions,
      options
    )

    this.#instance = createLogger(options)
    this.#name = options.name! as Opaque<string, 'Logger'>
  }

  public info(...messages: unknown[]): void {
    this.#instance.info(messages)
  }

  public warn(...messages: unknown[]): void {
    this.#instance.warn(messages)
  }

  public error(...messages: unknown[]): void {
    this.#instance.error(messages)
  }

  public debug(...messages: unknown[]): void {
    this.#instance.debug(messages)
  }

  public toString(): string {
    return `Logger {${this.#name}}`
  }
}
