const { ApplicationCommandOptionType, Client, Interaction, PermissionFlagsBits } = require('discord.js');
const GuildSettings = require('../../models/GuildSettings');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({ content: 'Вы можете запускать эту команду только внутри сервера.', ephemeral: true });
      return;
    }

    const targetRoleId = interaction.options.get('role').value;

    try {
      await interaction.deferReply();

      let autoRole = await GuildSettings.findOne({ guildId: interaction.guild.id });

      if (autoRole) {
        autoRole.JoinGuildRole.enable = true;
        autoRole.JoinGuildRole.roleId = targetRoleId;
      } else {
        autoRole = new GuildSettings({
          guildId: interaction.guild.id,
          JoinGuildRole: {
            enable: true,
            roleId: targetRoleId,
          },
        });
      }

      await autoRole.save();
      interaction.editReply({ content: 'Автороль успешно настроена. Чтобы отключить, выполните `/autorole-disable`', ephemeral: true });
    } catch (error) {
      console.log(error);
    }
  },

  name: 'autorole-configure',
  description: 'Настройте автороль для вашего сервера.',
  deleted: false,
  options: [
    {
      name: 'role',
      description: 'Роль, которую вы хотите дать пользователям при присоединении.',
      type: ApplicationCommandOptionType.Role,
      required: true,
      multiple: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.ManageRoles],
};