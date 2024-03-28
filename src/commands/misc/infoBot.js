const { EmbedBuilder } = require("discord.js");
const { infoBot } = require('../../../config.json');
const BotSetting = require("../../models/Bot-Setting");

module.exports = {
  name: "infobot",
  description: "Информация о боте",
  deleted: false,
  devOnly: false,
  testOnly: false,

  callback: async (client, interaction) => {

    const botSettings = await BotSetting.findOne();
    const [day, month, year] = botSettings.infoBot.lastupdate.split('.').map(Number);
    const timestamp = Math.floor(new Date(year, month - 1, day).getTime() / 1000);
    const versionBotFormatted = `<t:${timestamp}:d>`;
    const uptimeTimestamp = Math.floor(client.readyTimestamp / 1000);
    const uptimeFormatted = `<t:${uptimeTimestamp}:R>`;

    const membersEmoji = '<:members_total:1218578680889085972>';
    const totalChannelEmoji = '<:channels_total:1218580793681776782>';
    const totalServerEmoji = '<:diamond:1218866922376925214>';

    const embed = new EmbedBuilder()
      .setColor(botSettings.settingsBot.colorEmbedBased)
      .setAuthor({ name: `${client.user.username} - информация`, iconURL: client.user.displayAvatarURL() })      
      .setDescription('\`ru\` Я кастомный бот, который помогает клиентам и выполняет сложные задачи. Введите команду /help, чтобы узнать больше о доступных функциях.\n\n\`eng\` I am a customer support bot that helps customers and performs complex tasks. Enter the /help command to learn more about the available functionality.')
      .addFields(
        { name: 'Обслуживание:', value: `${totalServerEmoji}Серверов: **${client.guilds.cache.size.toString()}**\n${totalChannelEmoji}Каналов: **${client.channels.cache.size.toString()}**\n${membersEmoji}Пользователей: **${client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)}**` },
        { name: 'Последний перезапуск:', value: `${uptimeFormatted}`, inline: true },
        //{ name: '\u200b', value: '\u200b', inline: true },
        { name: 'Сборка:', value: `${botSettings.infoBot.versionBot} (${versionBotFormatted})`, inline: true },
        { name: 'Разработчик:', value: infoBot.author, inline: true },
      )
      .setFooter({ text: 'Спасибо, что используете нашего бота!'});

    await interaction.reply({ embeds: [embed] });
  }
};