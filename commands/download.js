const _ = require('lodash')
const { MessageEmbed } = require('discord.js')
const { search } = require('../struct/movie')
const paginationEmbed = require('../util/paginationEmbed')

module.exports = {
    name: 'download',
    aliases: ['search', 'get', 'd', 'down'],
    description: '**Search download link for movie** > Example(s): `m! download radhe`',
    exec: async (msg, args) => {
        if (!args.length) return msg.channel.send({ embed: { description: 'Please provide movie / series name.', color: 'RED' } })
        const query = args.join(' ')
        const result = await search(query)
        if (!result.length) return msg.channel.send({ embed: { description: 'No results found!', color: 'RED' } })

        let pages = _.chunk(result, 10)
        pages = pages.map(page => new MessageEmbed()
            .setTitle(`Search result for ${query}`)
            .setDescription(`${page.map(file => `➤ **[${file}](${process.env.BASE_URL}/${file})**`).join('\n')}`)
            .setColor('RANDOM'))

        return paginationEmbed(msg.channel, msg.author, pages)
    },
}
