const { getTopUsersForGuild, getTopUsers } = require('../../utils/getTopUsers');
const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: "toplevel",
    description: "Список пользователей с самым высоким уровнем на всех серверах, где есть бот",
    deleted: false,
    devOnly: false,
    testOnly: false,
    levelsystem: true,

    options: [
        {
            name: 'target',
            description: 'Выберите цель',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Текущий сервер',
                    value: 'server',
                },
                {
                    name: 'Глобальный топ',
                    value: 'global',
                },
            ],
        },
    ],

    callback: async (client, interaction) => {
        const target = interaction.options.getString('target');
        const guildId = interaction.guild.id;

        if (target === 'server') {
            const topUsers = await getTopUsersForGuild(guildId);

            if (topUsers === null || topUsers.length === 0) {
                return interaction.reply({ content: "Данных нет.", ephemeral: true });
            } else {
                const guild = client.guilds.cache.get(guildId);
                const userList = topUsers.slice(0, 10).map((user, i) => {
                    let emoji;
                    if (i === 0) {
                        emoji = '🥇';
                    } else if (i === 1) {
                        emoji = '🥈';
                    } else if (i === 2) {
                        emoji = '🥉';
                    } else {
                        emoji = '🎖️';
                    }
            
                    return `\`№${i + 1}\` ${emoji} <@${client.users.cache.get(user.userId)?.id || 'Неизвестный пользователь'}>\n┊Уровень - \`${user.level}\`┊Опыт - \`${user.xp}\``;
                }).join('\n\n');

                const embed = {
                    color: 0x0099ff,
                    title: `🏆 Топ пользователей на сервере ${guild.name}`,
                    thumbnail: { url: guild.iconURL({ dynamic: true }) },
                    description: `⁣ \n${userList}`,
                };

                interaction.reply({ embeds: [embed], ephemeral: false });
            }
        } else if (target === 'global') {
            const globalTopUsers = await getTopUsers();

            if (globalTopUsers === null || globalTopUsers.length === 0) {
                return interaction.reply({ content: "Данных нет.", ephemeral: true });
            } else {
                const userList = globalTopUsers.slice(0, 15).map((user, i) => {
                    let emoji;
                    if (i === 0) {
                        emoji = '🥇';
                    } else if (i === 1) {
                        emoji = '🥈';
                    } else if (i === 2) {
                        emoji = '🥉';
                    } else {
                        emoji = '🎖️';
                    }
            
                    return `\`№${i + 1}\` ${emoji} <@${client.users.cache.get(user.userId)?.id || 'Неизвестный пользователь'}>\n┊Уровень - \`${user.level}\`┊Опыт - \`${user.xp}\`┊Сервер - \`${client.guilds.cache.get(user.guildId)?.name || 'Неизвестный сервер'}\``;
                }).join('\n\n');
                
                const embed = {
                    color: 0x0099ff,
                    title: '🏆 Глобальный топ пользователей',
                    thumbnail: { url: client.user.displayAvatarURL({ dynamic: true }) },
                    description: `⁣ \n${userList}`,
                };

                interaction.reply({ embeds: [embed], ephemeral: false });
            }
        } else {
            interaction.reply({ content: "Недопустимая цель.", ephemeral: true });
        }
    },
};