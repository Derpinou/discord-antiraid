import {AntiRaidManager} from './AntiRaidManager';
import {sep} from 'path';
import {AntiRaidManagerOptions, Case, EventsNames} from './interfaces';
import {Guild, GuildMember} from 'discord.js';
import {RESTGetAPIAuditLogQuery, RESTGetAPIAuditLogResult} from 'discord-api-types/v9';
import {AuditActionsTypes} from './constants';

export abstract class BaseEvent {
	protected _manager: AntiRaidManager;
	public name: EventsNames;
	constructor (manager: AntiRaidManager, filename: string) {
		this._manager = manager;
		this.name = filename.split(sep)[filename.split(sep).length - 1].replace('.js', '') as EventsNames;
	}
	protected abstract run(...args: any[]): void

	protected checkEvent (options: AntiRaidManagerOptions): boolean {
		return !!options.events.includes(this.name as EventsNames);
	}

	protected checkUser (options: AntiRaidManagerOptions, memberId: string): boolean {
		return !!options.exemptedUsers.includes(memberId);
	}

	protected checkRoles (options: AntiRaidManagerOptions, member: GuildMember): boolean {
		return options.exemptedRoles.some(role => member.roles.cache.has(role));
	}

	protected async antiraid (guildId: string, event: string, startAt: number, targetId: string) {
		const options = await this._manager.getOptionsFromDb(guildId);
		const guild = this._manager._client.guilds.cache.get(guildId) as Guild;

		if (!guild) return undefined;

		if (!this.checkEvent(options)) return undefined;

		const auditLogsRequest = await this._manager._request.get(`/guilds/${guildId}/audit-logs`, {
			params: {
				limit: 1,
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				//@ts-ignore
				action_type: AuditActionsTypes[event],
			} as RESTGetAPIAuditLogQuery
		}).then(res => res.data).catch(e => this._manager.emit('error', e)) as RESTGetAPIAuditLogResult;

		if (!auditLogsRequest) return undefined;

		if (auditLogsRequest.audit_log_entries[0].target_id !== targetId) return undefined;
		console.log(1);

		if (this.checkUser(options, auditLogsRequest.audit_log_entries[0].user_id as string)) return undefined;

		const member = guild.members.cache.get(auditLogsRequest.audit_log_entries[0].user_id as string);

		if (!member) return undefined;

		if (this.checkRoles(options, member)) return undefined;

		const oldCase = this._manager.search(member, event);

		const punishable = this._manager.punishable(options, oldCase as Case);

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
		return this._manager.addCase(options, member.user.id, member.guild.id, event, startAt, oldCase as Case);
	}
}