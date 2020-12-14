const fetch = require('node-fetch')
class BlackList {
    constructor(token) {
        this.token = token;
    }
    async checkBlackList (id) {
        return console.log("You can't use this function, api balckist are not updated for work")
        /*
        fetch(`https://protect-bot.fr/api/?apiKey=${this.token}&checkblacklist=${id}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
            */
    }
}
module.exports = BlackList