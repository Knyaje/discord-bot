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
        interaction.editReply({ content: 'Автороль не была настроена для этого сервера. Используйте `/autorole-configure`, чтобы настроить ее.', ephemeral: true });
        return;
      }

      await GuildSettings.findOneAndUpdate({ guildId: interaction.guild.id }, { 'JoinGuildRole.enable': false });
      interaction.editReply({ content: 'Автороль отключена для этого сервера.', ephemeral: true });
    } catch (error) {
      console.log(error);
    }
  },

  name: 'autorole-disable',
  deleted: false,
  description: 'Отключить автороль на этом сервере.',
  permissionsRequired: [PermissionFlagsBits.Administrator],
};