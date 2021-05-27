const Fuse = require('fuse.js')
const axios = require('axios')
const cacheManager = require('cache-manager')

const memoryCache = cacheManager.caching({ store: 'memory', ttl: 300/* seconds */ })

const split = string => string.split('.')
    .join(' ')
    .split('-')
    .join(' ')
    .split('_')
    .join(' ')
    .toLowerCase()

const getData = async () => {
    const { data: { data } } = await axios.get('https://cdn.0iq.in/cdn/', {
        headers: {
            authorization: 'Basic YWRtaW46c2V4eWRhcnNo',
        },
    })

    return Object.keys(data).map(file => ({ name: split(file), file }))
}

module.exports.search = async (query) => {
    const files = await memoryCache.wrap('data', async () => getData())
    const fuse = new Fuse(files, { keys: ['name'], minMatchCharLength: split(query).length, shouldSort: true })

    const result = fuse.search(query.toLowerCase())

    return result.map(file => file.item.file)
}
