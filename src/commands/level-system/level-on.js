const { updateGuildSettings } = require('../../utils/getGuildSettings');
const { PermissionFlagsBits } = require('discord.js');


module.exports = {
  name: 'enablelevelsystem',
  description: 'Включить систему уровней на сервере',
  devOnly: false,
  testOnly: false,
  levelsystem: false,
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.ManageRoles],

  callback: async (client, interaction) => {
    const guildId = interaction.guild.id;
    const result = await updateGuildSettings(guildId, { levelSystemEnabled: true });

    if (result) {
      interaction.reply('Система уровней включена на сервере.');
    } else {
      interaction.reply('Произошла ошибка при включении системы уровней.');
    }
  },
};