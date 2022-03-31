"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditActionsTypes = exports.defaultOptions = void 0;
const v9_1 = require("discord-api-types/v9");
exports.defaultOptions = {
    enabled: true,
    events: [],
    exemptedUsers: [],
    exemptedRoles: [],
    rateLimit: 3,
    time: 10000,
    sanction: 'kick',
    reason: 'discord-antiraid',
};
exports.AuditActionsTypes = {
    'channelCreate': v9_1.AuditLogEvent.ChannelCreate,
    'channelDelete': v9_1.AuditLogEvent.ChannelDelete,
    'roleCreate': v9_1.AuditLogEvent.RoleCreate,
    'roleDelete': v9_1.AuditLogEvent.RoleDelete,
    'guildBanAdd': v9_1.AuditLogEvent.MemberBanAdd,
    'guildBanRemove': v9_1.AuditLogEvent.MemberBanRemove,
    'threadCreate': v9_1.AuditLogEvent.ThreadCreate,
    'threadDelete': v9_1.AuditLogEvent.ThreadDelete,
    'guildMemberRemove': v9_1.AuditLogEvent.MemberKick,
};
