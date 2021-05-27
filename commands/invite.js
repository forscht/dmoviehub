
module.exports = {
    name: 'invite',
    aliases: ['i', 'get'],
    description: '**Invite me to your server.** > Example(s): `m! invite`',
    exec: async (msg) => {
        const { client } = msg
        const owner = await client.users.fetch(client.owner)

        const embed = {
            color: 'RANDOM',
            description: `> Hey, I'm glad you liked D MovieHub! Here is the [Invite Link](${client.inviteLink.replace('CLIENT_ID', client.user.id)}). \n> D MovieHub also has [a support server](${client.supportServer})!`,
            footer: { text: `Servers ${client.guilds.cache.size} | Developer ${owner.tag}` },
            timestamp: new Date().toISOString(),
        }

        const message = await msg.channel.send({ embed })

        return message.delete({ timeout: 20000 })
    },
}
