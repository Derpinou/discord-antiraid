import {ActionType, AntiRaidManagerOptions} from './interfaces';
import {AuditLogEvent} from 'discord-api-types/v9';

export const defaultOptions: AntiRaidManagerOptions = {
	enabled: true,
	events: [],
	exemptedUsers: [],
	exemptedRoles: [],
	rateLimit: 3,
	time: 10000,
	sanction: 'kick',
	reason: 'discord-antiraid',
};

export const AuditActionsTypes: ActionType = {
	'channelCreate': AuditLogEvent.ChannelCreate,
	'channelDelete': AuditLogEvent.ChannelDelete,
	'roleCreate': AuditLogEvent.RoleCreate,
	'roleDelete': AuditLogEvent.RoleDelete,
	'guildBanAdd': AuditLogEvent.MemberBanAdd,
	'guildBanRemove': AuditLogEvent.MemberBanRemove,
	'threadCreate': AuditLogEvent.ThreadCreate,
	'threadDelete': AuditLogEvent.ThreadDelete,
	'guildMemberRemove': AuditLogEvent.MemberKick,
};