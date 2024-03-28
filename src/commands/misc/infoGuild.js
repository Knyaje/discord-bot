const { EmbedBuilder, ChannelType } = require('discord.js');
const { getGuildSettings } = require('../../utils/getGuildSettings');
const { RSQ, DeadZone } = require('../../../config.json');
const BotSetting = require("../../models/Bot-Setting");

module.exports = {
  name: 'infoguild',
  description: 'Показывает информацию о сервере',
  deleted: false,
  devOnly: false,
  testOnly: false,
  levelsystem: false,
  callback: async (client, interaction) => {
    const guild = interaction.guild;
    const guildId = interaction.guild.id;

    // Получаем информацию о состоянии системы уровней
    const guildSettings = await getGuildSettings(guildId);
    const botSettings = await BotSetting.findOne();

    const thumbnail = guild.iconURL() ? { url: guild.iconURL() } : null;

    const membersEmoji = '<:members_total:1218578680889085972>';
    const memberEmoji = '<:members:1218579373385580665>';
    const botEmoji = '<:bot:1218579375553904681>';
    const memberCount = guild.members.cache.filter(member => !member.user.bot).size;
    const botCount = guild.members.cache.filter(member => member.user.bot).size;
    
    const totalChannelEmoji = '<:channels_total:1218580793681776782>';
    const textChannelEmoji = '<:text_channel:1218580795497779221>';
    const voiceChannelEmoji = '<:voice_channel:1218580797100130336>';
    const channels = await guild.channels.fetch();
    const totalChannelCount = channels.filter(channel => channel.type === ChannelType.GuildText).size + channels.filter(channel => channel.type === ChannelType.GuildVoice).size;
    const textChannelCount = channels.filter(channel => channel.type === ChannelType.GuildText).size;
    const voiceChannelCount = channels.filter(channel => channel.type === ChannelType.GuildVoice).size;

    const onlineEmoji = '<:online:1218580402331975830>';
    const idleEmoji = '<:idle:1218580212300648472>';
    const dndEmoji = '<:dnd:1218580403930140825>';
    const offlineEmoji = '<:offline:1218580916344193074>';
    const onlineMembers = guild.members.cache.filter(member => member.presence?.status === 'online').size;
    const idleMembers = guild.members.cache.filter(member => member.presence?.status === 'idle').size;
    const dndMembers = guild.members.cache.filter(member => member.presence?.status === 'dnd').size;
    const offlineMembers = guild.members.cache.filter(member => member.presence?.status === 'offline').size;

    let uniqueSystemDescription;

    if (RSQ.BattalionGuildsID.includes(guild.id)) {
      uniqueSystemDescription = 'RSQ Module: **Вкл**';
    } else if (guild.id === DeadZone.DiscordGuildID) {
      uniqueSystemDescription = 'DZ Module: **Вкл**';
    } else {
      uniqueSystemDescription = 'Не обнаружено';
    }

    const embed = new EmbedBuilder()
      .setTitle(guild.name)
      .setColor(botSettings.settingsBot.colorEmbedBased)
      .setDescription(guild.description)
      .addFields(
        { name: 'Участники:', value: `${membersEmoji}Всего: **${guild.memberCount}**\n${memberEmoji}Людей: **${memberCount}**\n${botEmoji}Ботов: **${botCount}**`, inline: true },
        { name: 'По статусам:', value: `${onlineEmoji}В сети: **${onlineMembers}**\n${idleEmoji}Неактивен: **${idleMembers}**\n${dndEmoji}Не беспокоить: **${dndMembers}**\n${offlineEmoji}Не в сети: **${offlineMembers}**`, inline: true },
        { name: 'Каналы:', value: `${totalChannelEmoji}Всего: **${totalChannelCount}**\n${textChannelEmoji}Текстовых: **${textChannelCount}**\n${voiceChannelEmoji}Голосовых: **${voiceChannelCount}**`, inline: true },
        { name: 'Владелец:', value: `<@${guild.ownerId}>`, inline: true },
        { name: 'Разное:', value: `Роли: **${guild.roles.cache.size}**`, inline: true },
        { name: 'Дата создания:', value: `<t:${Math.floor(guild.createdAt.getTime() / 1000)}:D>\n<t:${Math.floor(guild.createdAt.getTime() / 1000)}:R>`, inline: true },
        { name: 'Базовые системы:', value: `Уровни: **${guildSettings ? (guildSettings.levelSystemEnabled ? 'Вкл' : 'Выкл') : 'Не настроено'}**\nАвтовыдача ролей: **${guildSettings ? (guildSettings.JoinGuildRole.enable ? 'Вкл' : 'Выкл') : 'Не настроено'}**\nlogs leave: **${guildSettings ? (guildSettings.leaveGuildMember.enable ? 'Вкл' : 'Выкл') : 'Не настроено'}**`, inline: true },
        { name: 'Уникальные системы:', value: uniqueSystemDescription, inline: true },
      )
      .setThumbnail(thumbnail?.url);

    await interaction.reply({ embeds: [embed] });
  },
};