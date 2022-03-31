import {BaseEvent} from '../../BaseEvent';
import {AntiRaidManager} from '../../AntiRaidManager';
import {GuildChannel} from 'discord.js';

export default class ChannelCreate extends BaseEvent {
	constructor (manager: AntiRaidManager) {
		super(manager, __filename);
	}
	async run (channel: GuildChannel) {
		await this.antiraid(channel.guild.id, this.name, Date.now(), channel.id);
	}
}