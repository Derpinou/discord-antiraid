"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEvent = void 0;
const path_1 = require("path");
const constants_1 = require("./constants");
class BaseEvent {
    constructor(manager, filename) {
        this._manager = manager;
        this.name = filename.split(path_1.sep)[filename.split(path_1.sep).length - 1].replace('.js', '');
    }
    checkEvent(options) {
        return !!options.events.includes(this.name);
    }
    checkUser(options, memberId) {
        return !!options.exemptedUsers.includes(memberId);
    }
    checkRoles(options, member) {
        return options.exemptedRoles.some(role => member.roles.cache.has(role));
    }
    antiraid(guildId, event, startAt, targetId) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = yield this._manager.getOptionsFromDb(guildId);
            const guild = this._manager._client.guilds.cache.get(guildId);
            if (!guild)
                return undefined;
            if (!this.checkEvent(options))
                return undefined;
            const auditLogsRequest = yield this._manager._request.get(`/guilds/${guildId}/audit-logs`, {
                params: {
                    limit: 1,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    action_type: constants_1.AuditActionsTypes[event],
                }
            }).then(res => res.data).catch(e => this._manager.emit('error', e));
            if (!auditLogsRequest)
                return undefined;
            if (auditLogsRequest.audit_log_entries[0].target_id !== targetId)
                return undefined;
            console.log(1);
            if (this.checkUser(options, auditLogsRequest.audit_log_entries[0].user_id))
                return undefined;
            const member = guild.members.cache.get(auditLogsRequest.audit_log_entries[0].user_id);
            if (!member)
                return undefined;
            if (this.checkRoles(options, member))
                return undefined;
            const oldCase = this._manager.search(member, event);
            const punishable = this._manager.punishable(options, oldCase);
            if (punishable) {
                switch (options.sanction) {
                    case 'kick':
                        return this._manager.kick(guildId, member.id, options.reason);
                    case 'ban':
                        return this._manager.ban(guildId, member.id, options.reason);
                    case 'removeAllRoles':
                        return this._manager.removeRoles(guildId, member.id, options.reason);
                }
            }
            return this._manager.addCase(options, member.user.id, member.guild.id, event, startAt, oldCase);
        });
    }
}
exports.BaseEvent = BaseEvent;
