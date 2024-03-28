const { channelTimers, deleteChannelAndCancelTimer } = require('../../utils/activeArrays');

module.exports = async (client, deletedChannel) => {
    // Проверяем, был ли удален канал из нашего сервера и существует ли таймер для него
    if (deletedChannel.guild && channelTimers[deletedChannel.id]) {
        // Удаляем канал и отменяем соответствующий таймер
        deleteChannelAndCancelTimer(deletedChannel);
    }
};