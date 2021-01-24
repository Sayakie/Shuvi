import type { ModuleOptions } from './Module'

export type PluginOptions = Record<string, unknown> & ModuleOptions
export type PluginEntry = (Plugin: PluginOptions) => () => void
