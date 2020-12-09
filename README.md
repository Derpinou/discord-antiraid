# discord-antiraid
Npm for protect server for Raid attacks

Supported Events:
```js
 channelDelete
 
 emojiCreate
 emojiDelete
 
 roleCreate
 roleDelete
 
 webHookUpdate
 
 guildBanAdd
```

List of AntiRaid Methods:
```js
const {AntiRaid} = require('discord-antiraid');
let antiRaid = new AntiRaid(client, {
    rateLimit: 3,
    time: 10000, 
    ban: false,
    kick: true,
    exemptMembers: [],
    exemptRoles: [],
    exemptEvent: []
})
let member = client.guilds.cache.get("").members.cache.get(""),
event = "guildBanAdd";



let obj = antiRaid.search(member, event)
console.log(obj)
/*
Output:
{
  id: 'XXXXXXXXXXXXXXXXXX',
  guild: 'XXXXXXXXXXXXXXXXXX',
  event: 'guildBanAdd',
  startedAt: XXXXXXXXXXXXX,
  rate: 1
}
*/
antiRaid.addCase(member, event, obj, Date.now())

antiRaid.punish(member)

antiRaid.checkExempt(member)

antiRaid.checkCase(member, event, obj)
```