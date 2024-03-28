const channelTimers = {};
const queue = [];

async function deleteChannelAndCancelTimer(client, channelId) {
    try {
        const channel = await client.channels.fetch(channelId);
        if (channel) {
            await channel.delete();
            if (channelTimers[channel.id]) {
                clearTimeout(channelTimers[channel.id]);
                delete channelTimers[channel.id];
            }
        } else {
            console.error(`Ошибка при удалении канала (#9001): Канал с ID ${channelId} не существует.`);
        }
    } catch (error) {
        console.error(`Ошибка при удалении канала (#9000): ${error}`);
    }
}


module.exports = {
    channelTimers,
    queue,
    deleteChannelAndCancelTimer
};