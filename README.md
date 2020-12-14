[![downloadsBadge](https://img.shields.io/npm/dt/discord-antiraid?style=for-the-badge)](https://npmjs.com/discord-antiraid)
[![versionBadge](https://img.shields.io/npm/v/discord-antiraid?style=for-the-badge)](https://npmjs.com/discord-antiraid)
[![discord](https://discord.com/api/guilds/559414466664464384/widget.png)](https://discord.gg/yAYZumWDA4)
# discord-antiraid
Npm package to protect Discord servers from Raid attacks

Installation:
```
npm i discord-antiraid
```
Supported Events:
```js
 channelCreate
 channelDelete
 
 emojiCreate
 emojiDelete
 
 roleCreate
 roleDelete
 
 webHookUpdate
 
 guildBanAdd
guildMemberRemove
```

AntiRaid Methods:
```js
const {AntiRaid} = require('discord-antiraid');
(async ()=> {
    let antiRaid = new AntiRaid(client, {
        rateLimit: 3,
        time: 10000, 
        ban: false,
        kick: true,
        exemptMembers: [],
        exemptRoles: [],
        exemptEvent: [],
        reason: "Punis par l'antiRaid"
    })
    let member = client.guilds.cache.get("").members.cache.get(""),
    event = "guildBanAdd";
    
    
    
    let obj = await antiRaid.search(member, event)
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

    let cooldown = antiRaid.cooldown;
    console.log(cooldown)

    await antiRaid.addCase(member, event, obj, Date.now())

    await antiRaid.punish(member)


    await antiRaid.checkExempt(member)

    let check = await antiRaid.checkCase(member, event, obj)
    console.log(check)
    /*
    Output:
        true/false
    */
})
```
AntiInvite Methods:
```js
const {AntiInvite} = require('discord-antiraid');

 
let antiInvite = new AntiInvite(client, {
    invalid: true,                                             
    rateLimit: 3,                                            
    time: 10000,                                             
    ban: false,                                             
    kick: true,                                       
    exemptMembers: [],
    exemptRoles: [],
    reason: "Punis par l'antiInvite"
})
let member = client.guilds.cache.get("").members.cache.get("");



let obj = await antiInvite.search(member)
console.log(obj)
/*
Output:
{
  id: 'XXXXXXXXXXXXXXXXXX',
  guild: 'XXXXXXXXXXXXXXXXXX',
  startedAt: XXXXXXXXXXXXX,
  rate: 1
}
*/

let cooldown = antiInvite.cooldown;
console.log(cooldown)

await antiInvite.addCase(member, obj, Date.now())

await antiInvite.punish(member)

await antiInvite.checkExempt(member)

let check = await antiInvite.checkCase(member, event, obj)
console.log(check)
/*
Output:
    true/false
*/

client.on("message", async (message)=> {
    let invite = await antiInvite.checkInvit(message)
    console.log(invite)
})
```
Check Blacklist Protect-Bot API (don't working)
```js
const {Blacklist} = require('discord-antiraid');

(async () => {
    //Check here to get API token: http://protect-bot.fr/membre/index.php?p=api
    let blacklist = new Blacklist("token")
    let check = await blacklist.checkBlackList("id");
    console.log(check)
    /*
    Output:
    {
      id: 'XXXXXXXXXXXXXXXXXX',
      blacklist: true/false,
      blacklister: XXXXXXXXXXXXX,
      raison: "Selfbot",
      "date":"XXXXXXXXXX"
    }
    */
})
```
Get package version:
```js
const {Version} = require('discord-antiraid');
console.log(Version);
//Output: 1.0.2
```