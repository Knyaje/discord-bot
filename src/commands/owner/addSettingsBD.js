const GuildSettings = require('../../models/GuildSettings');

module.exports = {
    name: 'regbd',
    description: 'Добавление сервера в базу данных',
    deleted: false,
    devOnly: true,
    hidden: true,

    callback: async (client, interaction) => {
        try {
            // Проверяем, существует ли запись GuildSettings для этой гильдии
            const existingGuildSettings = await GuildSettings.findOne({ guildId: interaction.guild.id });
        
            if (existingGuildSettings) {
                // Если запись уже существует, удаляем ее
                await GuildSettings.findOneAndDelete({ guildId: interaction.guild.id });
            }

            // Создаем новую запись GuildSettings для новой гильдии
            const newGuildSettings = new GuildSettings({
                guildId: interaction.guild.id,
                guildName: interaction.guild.name
            });
            
            await newGuildSettings.save();
            await interaction.reply({ content: `Гильдия успешно добавлена в базу данных: ${interaction.guild.name}`, ephemeral: true});
        } catch (error) {
            console.error({ content: `Произошла ошибка #8881: ${interaction.guild.id}: ${error}`, ephemeral: true });
        }
    },
};