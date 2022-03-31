import { BaseEvent } from '../../BaseEvent';
import { AntiRaidManager } from '../../AntiRaidManager';
import { GuildBan } from 'discord.js';
export default class ChannelCreate extends BaseEvent {
    constructor(manager: AntiRaidManager);
    run(ban: GuildBan): Promise<void>;
}
