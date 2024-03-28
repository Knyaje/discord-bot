const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { channelTimers, queue } = require('../../utils/activeArrays');
const { RSQ } = require('../../../config.json');

module.exports = {
    name: "arrayinfo",
    description: "Показать информацию о выбранном массиве",
    deleted: false,
    devOnly: true,
    testOnly: false,
    levelsystem: false,
    rsq_battalions: false,
    options: [
        {
            name: 'массив',
            description: 'Выберите тип меню',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Ожидающие удаления каналы',
                    value: 'channelToDelete'
                },
                {
                    name: 'Очередь на занесение данных',
                    value: 'queue'
                }
            ]
        }
    ],

    callback: async (client, interaction) => {

        try {
            // Получаем выбранный тип массива из введенных пользователем данных
            const arrayType = interaction.options.getString('массив');
            const timeToDeleteChannelMinutes = Math.floor(RSQ.config.timeToDeleteChannel / (1000 * 60));

            // Создаем Embed сообщение для вывода информации
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setFooter({ text: `Жизнь канала: ${timeToDeleteChannelMinutes}м`, iconURL: 'https://cdn.discordapp.com/attachments/981509664023924753/1205891529168650250/IMG_20240210_180119.jpg?ex=65da0500&is=65c79000&hm=0a6d150de41b23432c457dcb62070d7c3f0a13f26708d7d63547ad93da1e3bd3&' });

            // Добавляем информацию о выбранном массиве в Embed сообщение
            switch (arrayType) {
                case 'channelToDelete':
                    const channelInfo = Object.entries(channelTimers).map(([channelId, timestamp]) => {
                        const channel = interaction.guild.channels.cache.get(channelId);
                        const serverName = interaction.guild.name; // Имя сервера, где создан канал
                        if (!channel) return null; // Если канал не найден, пропускаем его
                        const creationTime = new Date(channel.createdTimestamp); // Получаем время создания канала
                        const formattedCreationTime = `${creationTime.getHours().toString().padStart(2, '0')}:${creationTime.getMinutes().toString().padStart(2, '0')}`; // Форматируем время создания канала в ЧЧ:ММ
                        return `- Сервер: ${serverName} | Канал: ${channel.name} | Время создания: ${formattedCreationTime}`;
                    }).filter(info => info !== null); // Фильтруем каналы, которые не нужно выводить
                    embed.setTitle('Информация о каналах, ожидающих удаления')
                    embed.setDescription(channelInfo.length ? channelInfo.join('\n') : 'Нет активных каналов для удаления');
                    break;            
                case 'queue':
                    const queueInfo = queue.map((user, index) => {
                        const serverName = user.guild.name; // Получаем имя сервера, на котором находится пользователь в очереди
                        const customNickname = user.member?.displayName; // Получаем кастомный никнейм, если он установлен, иначе используем никнейм с тэгом
                        return `- #${index + 1} | Сервер: ${serverName} | Пользователь: ${customNickname}`;
                    });
                    embed.setTitle('Информация о очереди на занесение данных')
                    embed.setDescription(queueInfo.length ? queueInfo.join('\n') : 'Никто не находится в очереди');
                    break;                
                default:
                    embed.setTitle('Неизвестный тип массива')
                    embed.setDescription('Такого типа массива не существует');
                    break;
            }

            // Отправляем Embed сообщение с информацией
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(`Произошла ошибка: ${error}`);

            const embedErrorMessage = new EmbedBuilder()
                .setTitle('Ошибка')
                .setColor('#FF0000')
                .setDescription('Произошла ошибка при выполнении');
    
            await interaction.reply({ embeds: [embedErrorMessage], ephemeral: false });    
        }
    }
};