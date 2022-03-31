import { BaseEvent } from '../../BaseEvent';
import { AntiRaidManager } from '../../AntiRaidManager';
import { Role } from 'discord.js';
export default class ChannelCreate extends BaseEvent {
    constructor(manager: AntiRaidManager);
    run(role: Role): Promise<void>;
}
