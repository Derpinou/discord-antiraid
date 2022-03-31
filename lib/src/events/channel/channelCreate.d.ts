import { BaseEvent } from '../../BaseEvent';
import { AntiRaidManager } from '../../AntiRaidManager';
import { GuildChannel } from 'discord.js';
export default class ChannelCreate extends BaseEvent {
    constructor(manager: AntiRaidManager);
    run(channel: GuildChannel): Promise<void>;
}
