const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'help',
    aliases: ['commands', '?'],
    description: '**Show command helps.** > Example(s): `m! help` `m! help <command name>`',
    exec: async (msg, args) => {
        const { prefix } = msg.client
        const commandHelp = msg.client.commands.get(args[0])
        const owner = await msg.client.users.fetch(msg.client.owner)
        if (commandHelp) {
            const embed = new MessageEmbed()
                .setAuthor(`${commandHelp.name} Usage`, msg.client.user.displayAvatarURL())
                .setDescription(`${commandHelp.description} \n> Aliases: ${commandHelp.aliases.map(a => `\`${a}\``).join(' | ')}`)

            return msg.channel.send(embed)
        }

        const embed = {
            title: `D MovieHub Help`,
            description: `Here is the list of commands!\nNeed more help? Come join our [server](${msg.client.supportServer})`,
            color: 'RANDOM',
            fields: [
                {
                    name: `D Movie Hub Commands`,
                    value: `\`${prefix}download\``,
                    inline: true,
                },
                {
                    name: ':wrench: Utility',
                    value: `\`${prefix}help\`  \`${prefix}ping\` \n\`${prefix}invite\``,
                    inline: true,
                },
            ],
            footer: {
                text: `More: ${prefix} help <command> | Servers ${msg.client.guilds.cache.size} | Developer ${owner.tag}`,
            },
        }

        return msg.channel.send({ embed })
    },
}
