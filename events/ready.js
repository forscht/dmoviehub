/* eslint-disable no-await-in-loop,no-restricted-syntax */
module.exports = async (client) => {
    console.log(`==== Bot ready :: ${client.user.username} =====`)
    await client.user.setActivity(`${client.prefix}download radhe`)
}
