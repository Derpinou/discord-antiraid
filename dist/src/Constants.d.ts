import { AntiRaidOptions, ActionType, Cooldown } from "./interfaces";
/**
 * The AntiRaid options
 * @typedef AntiRaidOptions
 *
 * @property {number} rateLimit=3 When rate Limit reached, do sanction
 * @property {number} time=10000 Time of the rate limit
 * @property {boolean} ban=true Ban Member
 * @property {boolean} kick=false Kick Member
 * @property {boolean} unrank=false Remove all roles of member
 * @property {Array<string>} exemptMembers=[] Ignored Members by AntiRaid
 * @property {Array<string>} exemptRoles=[] Ignored Roles by AntiRaid
 * @property {Array<string>} exemptEvent=[] Ignored Events by AntiRaid
 * @property {string} reason='discord-antiraid' Reason give to sanction
 */
export declare const defaultAntiRaidOptions: AntiRaidOptions;
/**
 * The Discord Audit Logs Action (see: https://discord.js.org/#/docs/main/stable/typedef/AuditLogAction)
 * @typedef AUDIT_LOG
 * @ignore
 *
 * @property {ActionType} [channelCreate]
 * @property {number} channelCreate.id=10 AuditLog's ID of channelCreate Event
 * @property {string} channelCreate.name='CHANNEL_CREATE' AuditLog's Name of channelCreate Event
 *
 * @property {ActionType} [channelDelete]
 * @property {number} channelDelete.id=12 AuditLog's ID of channelDelete Event
 * @property {string} channelDelete.name='CHANNEL_DELETE' AuditLog's Name of channelDelete Event
 *
 * @property {ActionType} [guildBanAdd]
 * @property {number} guildBanAdd.id=22 AuditLog's ID of guildBanAdd Event
 * @property {string} guildBanAdd.name='MEMBER_BAN_ADD' AuditLog's Name of guildBanAdd Event
 *
 * @property {ActionType} [guildMemberRemove
 * @property {number} guildMemberRemove.id=20 AuditLog's ID of guildMemberRemove Event
 * @property {string} guildMemberRemove.name='MEMBER_KICK'] AuditLog's Name of guildMemberRemove Event
 *
 * @property {ActionType} [roleCreate]
 * @property {number} roleCreate.id=30 AuditLog's ID of roleCreate Event
 * @property {string} roleCreate.name='ROLE_CREATE' AuditLog's Name of roleCreate Event
 *
 * @property {ActionType} [roleDelete]
 * @property {number} roleDelete.id=32 AuditLog's ID of roleDelete Event
 * @property {string} roleDelete.name='ROLE_DELETE' AuditLog's Name of roleDelete Event
 */
export declare const AUDIT_LOG: ActionType;
/**
 * Cooldown Types
 * @typedef CoolDown
 * @property {string} id Discord User ID
 * @property {string} guild Discord Guild ID
 * @property {string} event Discord event
 * @property {number} startedAt CoolDown timestamp
 * @property {number} rate Number of User action on event
 */
export declare const CoolDown: Cooldown;
