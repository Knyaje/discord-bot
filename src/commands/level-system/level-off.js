const { updateGuildSettings } = require('../../utils/getGuildSettings');
const { PermissionFlagsBits } = require('discord.js');


module.exports = {
  name: 'disablelevelsystem',
  description: 'Отключить систему уровней на сервере',
  devOnly: false,
  testOnly: false,
  levelsystem: true,
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.ManageRoles],

  callback: async (client, interaction) => {
    const guildId = interaction.guild.id;
    const result = await updateGuildSettings(guildId, { levelSystemEnabled: false });

    if (result) {
      interaction.reply('Система уровней выключена на сервере.');
    } else {
      interaction.reply('Произошла ошибка при выключении системы уровней.');
    }
  },
};