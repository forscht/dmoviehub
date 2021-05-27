/* eslint-disable global-require,import/no-dynamic-require */
const { Client, Collection } = require('discord.js')
const { readdirSync } = require('fs')
const path = require('path')

module.exports = class extends Client {
    constructor(opts) {
        super(opts)
        this.commands = new Collection()
        this.prefix = opts.prefix
        this.voteLink = opts.voteLink
        this.botToken = opts.botToken

        this.owner = process.env.OWNER
        this.inviteLink = process.env.BOT_INVITE_LINK
        this.supportServer = process.env.SUPPORT_SERVER_INVITE_LINK
        this.config = process.env
        this.stats = { commands: { } }
    }

    build() {
        this.loadCommands()
        this.loadEventListeners()
        this.login(this.botToken).then()
    }

    loadCommands() {
        const commands = readdirSync(path.join(__dirname, 'commands'))
        // eslint-disable-next-line no-restricted-syntax
        for (const commandFile of commands) {
            const command = require(`./commands/${commandFile}`)
            this.commands.set(command.name, command)
        }
    }

    updateCommandStats(command, key, count) {
        if (!this.stats.commands[command]) this.stats.commands[command] = { [key]: count }
        else if (!this.stats.commands[command][key]) this.stats.commands[command][key] = count
        else this.stats.commands[command][key] += count
    }

    genHealth() {
        return {
            activeVoice: this.voice.connections.size,
            servers: this.guilds.cache.size,
            users: this.users.cache.size,
            channels: this.channels.cache.size,
            ...this.stats,
        }
    }

    loadEventListeners() {
        readdirSync(`${__dirname}/events/`)
            .filter(file => file.endsWith('.js'))
            .map(file => this.on(file.split('.js')[0], require(`${__dirname}/events/${file}`).bind(null, this)))
    }
}
