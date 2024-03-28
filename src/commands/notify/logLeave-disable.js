const { Client, Interaction, PermissionFlagsBits } = require('discord.js');
const GuildSettings = require('../../models/GuildSettings');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    try {
      await interaction.deferReply();

      if (!(await GuildSettings.exists({ guildId: interaction.guild.id }))) {
        interaction.editReply({ content: 'Канал для логов не был настроен для этого сервера. Используйте `/logleave-configure`, чтобы настроить ее.', ephemeral: true });
        return;
      }

      await GuildSettings.findOneAndUpdate({ guildId: interaction.guild.id }, { 'leaveGuildMember.enable': false });
      interaction.editReply({ content: 'Канал для логов отключен для этого сервера.', ephemeral: true });
    } catch (error) {
      console.log(error);
    }
  },

  name: 'logleave-disable',
  deleted: false,
  description: 'Отключить канал для логов на этом сервере.',
  permissionsRequired: [PermissionFlagsBits.Administrator],
};