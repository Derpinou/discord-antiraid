import {BaseEvent} from '../../BaseEvent';
import {AntiRaidManager} from '../../AntiRaidManager';
import {GuildMember} from 'discord.js';

export default class ChannelCreate extends BaseEvent {
	constructor (manager: AntiRaidManager) {
		super(manager, __filename);
	}
	async run (member: GuildMember) {
		await this.antiraid(member.guild.id, this.name, Date.now(), member.id);
	}
}