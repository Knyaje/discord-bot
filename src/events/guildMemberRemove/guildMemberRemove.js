const { Client, GuildMember, EmbedBuilder } = require('discord.js');
const GuildSettings = require('../../models/GuildSettings');

/**
 *
 * @param {Client} client
 * @param {GuildMember} member
 */
module.exports = async (client, member) => {
    try {
        const guildSettings = await GuildSettings.findOne({ guildId: member.guild.id });

        if (guildSettings && guildSettings.leaveGuildMember.enable === true && guildSettings.leaveGuildMember.channelLog) {
            const channel = member.guild.channels.cache.get(guildSettings.leaveGuildMember.channelLog);

            if (channel) {
                const roles = member.roles.cache
                    .filter(role => role.name !== '@everyone') // Фильтруем роли, чтобы убрать упоминание @everyone
                    .map(role => role.toString()) // Преобразуем роли в строковый формат
                    .join(', '); // Объединяем роли через запятую
                                    
                const embed = new EmbedBuilder()
                    .setColor('#910000')
                    .setAuthor({ name: `${member.user.tag}`, iconURL: `${member.user.displayAvatarURL()}` })
                    .setThumbnail(`${member.user.displayAvatarURL()}`)
                    .setDescription(`<@${member.user.id}> **вышел**`)
                    .addFields({ name: 'Роли', value: roles || 'Отсутствуют'})
                    .setTimestamp()
                    .setFooter({ text: `${member.guild.name}` });

                channel.send({ embeds: [embed] });
            } else {
                console.error('Канал не найден #8888');
            }
        } 
    } catch (error) {
        console.error('Произошла ошибка #8888:', error);
    }
}