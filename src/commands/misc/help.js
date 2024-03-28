module.exports = {
    name: 'help',
    description: 'Узнать о доступном функционале',
    deleted: false,
    devOnly: false,
    testOnly: false,
    levelsystem: false,
    callback: async (client, interaction) => {
        await interaction.reply({ content: '*Команда находится в разработке / The command is under development*', ephemeral: true });
    },
};