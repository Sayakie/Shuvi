import type { Module, ModuleOptions } from '../structs/Module'
import type { PluginOptions } from '../structs/Plugin'

export * from './Common'
export * from './Snowflake'

export type ModuleEntry = {
  default: new (options: ModuleOptions) => Module
}
export type PluginEntry = {
  default: (options: PluginOptions) => FunctionConstructor
}
