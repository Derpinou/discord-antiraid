import { EventEmitter } from 'events';
import {Client, Collection, GuildMember} from 'discord.js';
import {readdir} from 'fs/promises';
import {AntiraidManagerEvents, AntiRaidManagerOptions, Case} from './interfaces';
import {sep} from 'path';
import {defaultOptions} from './constants';
import axios from 'axios';
import {AxiosInstance} from 'axios';
import {RESTPatchAPIGuildMemberJSONBody, RESTPutAPIGuildBanJSONBody} from 'discord-api-types/v9';

export class AntiRaidManager extends EventEmitter {
	public _client: Client;
	private _options: AntiRaidManagerOptions;
	public _request: AxiosInstance;
	public cases: Collection<string, Case[]>;
	constructor (client : Client, options?: AntiRaidManagerOptions) {
		super();
		this._client = client;
		this._options = options || defaultOptions;
		this.cases = new Collection();
		this._request = axios.create({
			baseURL: `${this._client.options.http?.api}/v${this._client.options.http?.version}`,
			headers: {
				Authorization: `Bot ${this._client.token}`
			}
		});
		this._handleEvents().catch(console.error);

		/*
		this._request.get('/guilds/834544848039968770').then(res => {
			console.log(res.data);
		});

		 */
	}

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	on<U extends keyof AntiraidManagerEvents>(
		event: U, listener: AntiraidManagerEvents[U]
	): this;

	emit<U extends keyof AntiraidManagerEvents>(
		event: U, ...args: Parameters<AntiraidManagerEvents[U]>
	): boolean;

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	private async _handleEvents () {
		const categories = await readdir(`${__dirname}${sep}events`);
		for (const category of categories) {
			const events = await readdir(`${__dirname}${sep}events${sep}${category}`);
			const js_files = events.filter(f => f.split('.').pop() === 'js');

			for (const event of js_files) {
				const eventName = event.split('.')[0];
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				const evt = require(`${__dirname}${sep}events${sep}${category}${sep}${event}`)['default'];
				const eventConstructor = new evt(this);
				//console.log(eventConstructor);
				this._client.on(eventName, (...args) => eventConstructor.run(...args));
			}
		}
	}
	public getOptionsFromDb (id: string) {
		return this._options;
	}

	public addCase (options: AntiRaidManagerOptions, user: string, guild: string, event: string, startedAt: number, oldCase: Case) {
		const cases = this.getCases(guild);
		const caseToPush: Case = 			{
			guild,
			startedAt,
			user,
			event,
			rate: oldCase && oldCase.rate ? oldCase.rate++ : 1
		};
		cases.push(caseToPush);
		this.cases.set(guild, cases);
		const index: number = cases.indexOf(caseToPush);
		setTimeout(() => {
			cases.splice(index);
		}, options.time);
		this.cases.set(guild, cases);
	}

	public getCases (id: string): Case[] {
		if (!this.cases.get(id)) {
			this.cases.set(id, []);
		}
		return this.cases.get(id) as Case[];
	}

	public search (member: GuildMember, event: string): Case | undefined {
		return this.getCases(member.guild.id).find(c => c.user === member.id && c.guild === member.guild.id && c.event === event);
	}

	public punishable (options: AntiRaidManagerOptions, caseToCheck: Case): boolean {
		return caseToCheck && caseToCheck.rate >= options.rateLimit -1;
	}

	public async ban (guild: string, member: string, reason: string) {
		await this._request.put(`/guilds/${guild}/bans/${member}`, {
			delete_message_days: 0,
			reason
		} as RESTPutAPIGuildBanJSONBody, {
			headers: {
				'X-Audit-Log-Reason': reason
			}
		}).catch((err) => {
			this.emit('error', err);
		});
	}

	public async kick (guild: string, member: string, reason: string) {
		await this._request.delete(`/guilds/${guild}/members/${member}`, {
			headers: {
				'X-Audit-Log-Reason': reason
			}
		}).catch((err) => {
			this.emit('error', err);
		});
	}

	public async removeRoles (guild: string, member: string, reason: string) {
		await this._request.patch(`/guilds/${guild}/members/${member}`, {
			roles: []
		} as RESTPatchAPIGuildMemberJSONBody, {
			headers: {
				'X-Audit-Log-Reason': reason
			}
		}).catch((err) => {
			this.emit('error', err);
		});
	}
}
