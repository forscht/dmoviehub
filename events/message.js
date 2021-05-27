/* eslint-disable no-param-reassign */
const errorPrint = require('../util/errorPrint')

module.exports = async (client, msg) => {
    if (!msg.guild) return
    if (msg.author.bot) return
    if (!msg.content.startsWith(client.prefix)) return
    if (!msg.channel.permissionsFor(msg.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES'])) return

    const args = msg.content.slice(client.prefix.length).trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    const command = client.commands.get(commandName) || client.commands.find(c => c.aliases && c.aliases.includes(commandName))

    if (command) {
        try {
            console.log(`==== command :: ${msg.content} | ${msg.guild.name} | ${msg.channel.name} | ${msg.author.tag}`)

            /** Check bot permissions for command * */
            if (command.clientPermissions && command.clientPermissions.length) {
                const permissions = msg.channel.permissionsFor(msg.guild.me)
                if (!permissions.has(command.clientPermissions)) {
                    client.updateCommandStats(commandName, 'botPermFilter', 1)

                    return
                }
            }

            /** Check user permissions for command * */
            if (command.userPermissions && command.userPermissions.length) {
                const permissions = msg.channel.permissionsFor(msg.author)
                if (!permissions.has(command.userPermissions)) {
                    await msg.channel.send({ embed: { color: 'RED', description: `> You're missing any of the permissions. ${command.userPermissions.map(perm => `\`${perm}\``).toString()}` } })
                    client.updateCommandStats(commandName, 'userPermFilter', 1)

                    return
                }
            }

            await command.exec(msg, args)
            client.updateCommandStats(commandName, 'success', 1)
        } catch (e) {
            errorPrint(e, { description: `command error :: ${msg.content} | ${msg.guild.name} | ${msg.channel.name} | ${msg.author.tag}` })
            client.updateCommandStats(commandName, 'failed', 1)
        }
    }
}
