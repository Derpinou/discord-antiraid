import {BaseEvent} from '../../BaseEvent';
import {AntiRaidManager} from '../../AntiRaidManager';
import {Role} from 'discord.js';

export default class ChannelCreate extends BaseEvent {
	constructor (manager: AntiRaidManager) {
		super(manager, __filename);
	}
	async run (role: Role) {
		await this.antiraid(role.guild.id, this.name, Date.now(), role.id);
	}
}