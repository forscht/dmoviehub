require('./util/config')
const Bot = require('./bot')
const health = require('./util/health')

const bot = new Bot({
    botToken: process.env.TOKEN,
    voteLink: process.env.VOTE_LINK,
    prefix: process.env.PREFIX,
    messageCacheMaxSize: 10,
    shards: 'auto',
    ws: { intents: ['GUILD_MESSAGES', 'GUILDS', 'GUILD_MESSAGE_REACTIONS'] },
})
bot.build()
health.build(() => bot.genHealth())()
