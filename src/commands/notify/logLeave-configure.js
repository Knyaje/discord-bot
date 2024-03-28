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

    const targetChannel = interaction.options.get('канал').value;

    try {
      await interaction.deferReply();

      let autoRole = await GuildSettings.findOne({ guildId: interaction.guild.id });

      if (autoRole) {
        autoRole.leaveGuildMember.enable = true;
        autoRole.leaveGuildMember.channelLog = targetChannel;
      } else {
        autoRole = new GuildSettings({
          guildId: interaction.guild.id,
          leaveGuildMember: {
            enable: true,
            channelLog: targetChannel,
          },
        });
      }

      await autoRole.save();
      interaction.editReply({ content: 'Канал для логов успешно настроен. Чтобы отключить, выполните `/logleave-disable`', ephemeral: true });
    } catch (error) {
      console.log(error);
    }
  },

  name: 'logleave-configure',
  description: 'Настройте логи при выходе пользователей с сервера, для вашего сервера.',
  deleted: false,
  options: [
    {
      name: 'канал',
      description: 'Канал, в который будут отправлятся логи.',
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.ManageRoles],
};