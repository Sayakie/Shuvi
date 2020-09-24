import type { GiveawayManagerOptions } from '../types'

export class GiveawayManager {
  options: GiveawayManagerOptions

  constructor(options: GiveawayManagerOptions) {
    this.options = { ...{}, ...options }
  }

  toString(): string {
    return `GiveawayManager {processing=${0}, ended={0}, total={0}, size={0}}`
  }
}
