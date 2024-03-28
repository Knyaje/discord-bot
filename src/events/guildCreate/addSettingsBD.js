const GuildSettings = require('../../models/GuildSettings');

module.exports = async (client, guild) => {
  try {
    // Проверяем, существует ли запись GuildSettings для этой гильдии
    const existingGuildSettings = await GuildSettings.findOne({ guildId: guild.id });

    if (existingGuildSettings) {
      // Если запись уже существует, сообщаем об этом
      console.log(`Гильдия уже добавлена в базу данных: ${guild.name}`);
    } else {
      // Создаем новую запись GuildSettings для новой гильдии
      const newGuildSettings = new GuildSettings({
        guildId: guild.id,
        guildName: guild.name
      });

      await newGuildSettings.save();
      console.log(`Новая гильдия успешно добавлена в базу данных: ${guild.name}`);
    }
  } catch (error) {
    console.error(`Error handling guild join event for guild ${guild.id}: ${error}`);
  }
};