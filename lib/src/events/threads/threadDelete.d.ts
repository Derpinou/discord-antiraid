import { BaseEvent } from '../../BaseEvent';
import { AntiRaidManager } from '../../AntiRaidManager';
import { ThreadChannel } from 'discord.js';
export default class ThreadDelete extends BaseEvent {
    constructor(manager: AntiRaidManager);
    run(thread: ThreadChannel): Promise<void>;
}
