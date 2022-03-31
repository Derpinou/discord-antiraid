import { BaseEvent } from '../../BaseEvent';
import { AntiRaidManager } from '../../AntiRaidManager';
import { GuildMember } from 'discord.js';
export default class ChannelCreate extends BaseEvent {
    constructor(manager: AntiRaidManager);
    run(member: GuildMember): Promise<void>;
}
