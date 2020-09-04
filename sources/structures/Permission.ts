import { Permissions } from 'discord.js'
import type { PermissionFlags } from 'discord.js'

export const Permission: PermissionFlags = { ...Permissions.FLAGS }
export const PermissionBit = Permissions.FLAGS
