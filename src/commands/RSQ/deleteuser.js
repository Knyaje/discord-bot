const { PermissionFlagsBits, ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const UserBattalion = require('../../models/RSQ-UsersBattalions');
const { spreadsheetId, sheets } = require("../../utils/table-91");

module.exports = {
    name: "deleteuser",
    description: "Профиль",
    deleted: true,
    devOnly: false,
    testOnly: false,
    levelsystem: false,
    rsq_battalions: true,
    options: [
        {
            name: 'позывной',
            description: 'Написать позывной',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],

    callback: async (client, interaction) => {
        try {
            const name = interaction.options.getString('позывной');

            // Удаление пользователя из базы данных
            const deletedUser = await UserBattalion.findOneAndDelete({ name });
            
            let regSuccesDB = '';
            let regSuccesGT = '';
            if (deletedUser) {
                regSuccesDB = '*Удалено успешно*'
            } else {
                regSuccesDB = '*Дело не обнаружено*'
            }

            const range = '7th Table | Users!B4:AO'; // Замените на ваш диапазон

            const res = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range,
            });

            const rows = res.data.values || [];
            const rowIndex = rows.findIndex(row => row[1] === name);

            if (rowIndex !== -1) {
                const response = await sheets.spreadsheets.batchUpdate({
                    spreadsheetId,
                    requestBody: {
                        requests: [{
                            deleteDimension: {
                                range: {
                                    sheetId: 0,
                                    dimension: 'ROWS',
                                    startIndex: rowIndex + 3, // С учетом смещения диапазона и заголовков таблицы
                                    endIndex: rowIndex + 4 // С учетом смещения диапазона и заголовков таблицы
                                }
                            }
                        }]
                    }
                });

                if (response.status === 200) {
                    regSuccesGT = '*Удалено успешно*'
                } else {
                    regSuccesGT = `*Произошла ошибка:*`, response.statusText
                }   
            } else {
                regSuccesGT = '*Дело не обнаружено*'
            }

            const embedSucces = new EmbedBuilder()
                .setColor('#910000')
                .setDescription(`**База данных:** ${regSuccesDB}\n**Google таблица:** ${regSuccesGT}`);
            
            await interaction.reply({ embeds: [embedSucces], ephemeral: true });
        } catch(error) {
            console.error(`Произошла ошибка (#7685): ${error}`);

            const embedErrorMessage = new EmbedBuilder()
                .setTitle('Ошибка')
                .setColor('#FF0000')
                .setDescription('Произошла ошибка при выполнении (#7685)');

            interaction.reply({ embeds: [embedErrorMessage], ephemeral: true });
        }
    }
}