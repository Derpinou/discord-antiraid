import {BaseEvent} from '../../BaseEvent';
import {AntiRaidManager} from '../../AntiRaidManager';
import {GuildBan} from 'discord.js';

export default class ChannelCreate extends BaseEvent {
	constructor (manager: AntiRaidManager) {
		super(manager, __filename);
	}
	async run (ban: GuildBan) {
		await this.antiraid(ban.guild.id, this.name, Date.now(), ban.user.id);
	}
}