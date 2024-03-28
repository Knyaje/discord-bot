const { Schema, model } = require('mongoose');

const BotsettingSchema = new Schema({
    infoBot: {
        versionBot: { // Работают ли кнопки в меню
            type: String,
            default: 'Скрыто',
        },
        lastupdate: { // Время обновления сборки
            type: String,
            default: '01.01.2024',
        }
    },
    settingsBot: {
        colorEmbedBased: { // Цвет базовых Embed сообщений
            type: String,
            default: '#000000',
        },
        colorEmbedError: { // Цвет Embed сообщений об ошибках
            type: String,
            default: '#FF0000',
        }
    },
    enableSystem: {
        buttonMenuRSQ: { // Работают ли кнопки в меню
            type: Boolean,
            default: true,
        },
        time: { // Во сколько примерно включится бот
            type: String,
            default: '00:00',
        }
    }
});

module.exports = model("BotSetting", BotsettingSchema);