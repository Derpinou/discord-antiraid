import {BaseEvent} from '../../BaseEvent';
import {AntiRaidManager} from '../../AntiRaidManager';
import {ThreadChannel} from 'discord.js';

export default class ThreadCreate extends BaseEvent {
	constructor (manager: AntiRaidManager) {
		super(manager, __filename);
	}
	async run (thread: ThreadChannel) {
		await this.antiraid(thread.guild.id, this.name, Date.now(), thread.id);
	}
}