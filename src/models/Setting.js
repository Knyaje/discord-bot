const { Schema, model } = require('mongoose');

const settingSchema = new Schema({
    guildID: {
        type: String,
        required: true, // Убедитесь, что поле guildID является обязательным для каждой записи
        unique: true, // Убедитесь, что поле guildID уникально в коллекции
    },
    guildName: String,
    raports: {
        categoryRaport: {
            type: String,
            default: false,
        },
        channelMod: {
            type: String,
            default: false,
        }
    }
});

module.exports = model("Setting", settingSchema);