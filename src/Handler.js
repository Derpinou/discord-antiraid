//Handler by Freiik: https://github.com/FreiikDev/discord-addons/blob/main/src/structures/handlersManager.js
const {readdirSync} = require('fs'),
    {sep} = require('path')
class Handler {
    constructor(client) {
        this.client = client
        let source = `${__dirname}${sep}events${sep}`;
        readdirSync(source).forEach((dir) => {
            if (dir[0] !== ".") {
                readdirSync(source + dir)
                    .filter((f) => f.endsWith(".js"))
                    .forEach((f, i) => {
                        try {
                            this.client.on(dir, require(`./events/${dir}/${f}`));
                        } catch (error) {
                            console.log(error);
                        }
                    });
            }
        });
    }
}
module.exports = Handler;