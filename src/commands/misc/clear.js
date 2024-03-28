const { PermissionFlagsBits, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  name: "clear",
  description: "Удаляет указанное количество сообщений в текущем текстовом канале.",
  deleted: false,
  devOnly: false,
  testOnly: false,
  options: [
    {
        name: 'количество',
        description: 'Укажите, сколько сообщений должно быть удалено?',
        type: ApplicationCommandOptionType.Integer,
        required: true
    }
  ],
  permissionsRequired: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.ManageMessages],

  callback: async (client, interaction) => {
    try {
      // Получаем количество сообщений для удаления из опций команды
      const amount = interaction.options.getInteger('количество');

      // Проверяем, является ли указанное количество сообщений допустимым
      if (amount <= 0 || amount > 100) {
        const embedErrorMessage = new EmbedBuilder()
          .setTitle('Ошибка')
          .setColor('#FF0000')
          .setDescription('Количество сообщений для удаления должно быть от 1 до 100');

        await interaction.reply({ embeds: [embedErrorMessage], ephemeral: true });
        return;
      }

      // Удаляем сообщения в текущем текстовом канале
      let messagesDeleted = 0;
      let messages = await interaction.channel.messages.fetch({ limit: amount });
      messages.forEach(async (message) => {
        if (messagesDeleted < amount && message.deletable) {
          await message.delete();
          messagesDeleted++;
        }
      });
      
      const embedSuccessMessage = new EmbedBuilder()
        .setTitle('Успешно')
        .setColor('#00FF00')
        .setDescription(`Успешно удалено ${amount} сообщений`);

      await interaction.reply({ embeds: [embedSuccessMessage], ephemeral: true });
    } catch (error) {
      console.error(`Произошла ошибка: ${error}`);

      const embedErrorMessage = new EmbedBuilder()
        .setTitle('Ошибка')
        .setColor('#FF0000')
        .setDescription('Произошла ошибка при выполнении команды');

      await interaction.reply({ embeds: [embedErrorMessage], ephemeral: true });
    }
  }
};