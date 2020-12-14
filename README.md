[![downloadsBadge](https://img.shields.io/npm/dt/discord-antiraid?style=for-the-badge)](https://npmjs.com/discord-antiraid)
[![versionBadge](https://img.shields.io/npm/v/discord-antiraid?style=for-the-badge)](https://npmjs.com/discord-antiraid)

# discord-antiraid
Npm for protect server for Raid attacks

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
        exemptEvent: []
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

    //Get the cooldown
    let cooldown = antiRaid.cooldown;
    console.log(cooldown)
    //Add Case to Cooldown

    await antiRaid.addCase(member, event, obj, Date.now())

    //Punish Member with options defined in the constructor
    await antiRaid.punish(member)
    //Check if event/role/member are in the exempt list at options

    await antiRaid.checkExempt(member)

    //Check if member as ready to ban
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


(async () => {   
    let antiInvite = new AntiInvite(client, {
        invalid: true,                                             
        rateLimit: 3,                                            
        time: 10000,                                             
        ban: false,                                             
        kick: true,                                       
        exemptMembers: [],
        exemptRoles: []
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

    //Get the cooldown
    let cooldown = antiInvite.cooldown;
    console.log(cooldown)
    //Add Case to Cooldown

    await antiInvite.addCase(member, obj, Date.now())
    //Punish Member with options defined in the constructor

    await antiInvite.punish(member)
    //Check if event/role/member are in the exempt list at options

    await antiInvite.checkExempt(member)
    //Check if member as ready to ban

    let check = await antiInvite.checkCase(member, event, obj)
    console.log(check)
    /*
    Output:
        true/false
    */
})
```
Check Blacklist Protect-Bot API (don't working)
```js
const {Blacklist} = require('discord-antiraid');

(async () => {
    //Check here for get Api TOKEN: http://protect-bot.fr/membre/index.php?p=api
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
//Output: 1.0.0
```