const { humanReadableCreatedTimestamp } = require('../util/date')
const errorPrint = require('../util/errorPrint')

module.exports = async (client, guild) => {
    try {
        const { supportServer } = client
        const channel = await client.channels.fetch(process.env.GUILD_UPDATE_CHANNEL)
        const owner = await client.users.fetch(guild.ownerID).catch(() => 'do nothing')
        const iconUrl = guild.iconURL({ format: 'png', dynamic: true, size: 1024 })

        const embed = {
            title: `Guild Join`,
            thumbnail: { url: iconUrl },
            color: 4437377,
            timestamp: Date.now(),
            footer: { text: `Guild Count ➤ ${client.guilds.cache.size}` },
            description: `➤ **[Name](${supportServer})** : ${guild.name}\n`
                + `➤ **[ID](${supportServer})** : ${guild.id}\n`
                + `➤ **[Members](${supportServer})** :  ${guild.memberCount}\n`
                + `➤ **[Owner](${supportServer})** : ${owner ? owner.tag : 'unknown'}\n`
                + `➤ **[Owner ID](${supportServer})** : ${guild.ownerID}\n`
                + `➤ **[Created At](${supportServer})** : ${humanReadableCreatedTimestamp(guild.createdTimestamp)}\n`
                + `➤ **[Region](${supportServer})** : ${guild.region}`,
        }
        await channel.send({ embed })
    } catch (e) {
        errorPrint(e, { description: 'guild create event', id: guild.id, name: guild.name })
    }
}
