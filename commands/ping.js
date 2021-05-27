module.exports = {
    name: 'ping',
    aliases: ['p'],
    description: '**Check ping of bot to servers.** > Example(s): `m! ping`',
    exec: async (msg) => {
        const { client } = msg
        const message = await msg.channel.send('Loading data...')
        await message.delete()

        const dataMessage = await msg.channel.send(`🏓Latency is ${message.createdTimestamp - msg.createdTimestamp}ms. WS Latency is ${Math.round(client.ws.ping)}ms`)

        await dataMessage.delete({ timeout: 20000 })
    },
}
