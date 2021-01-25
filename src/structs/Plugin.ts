import type { ModuleOptions } from './Module'

export type PluginOptions = Record<string, unknown> & ModuleOptions
export type PluginGateway = (Plugin: PluginOptions) => () => void
