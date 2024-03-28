const { Schema, model } = require('mongoose');

const settingSchema = new Schema({
    guildID: {
        type: String,
        required: true, // Убедитесь, что поле guildID является обязательным для каждой записи
        unique: true, // Убедитесь, что поле guildID уникально в коллекции
    },
    guildName: String, // При необходимости добавьте дополнительные поля для названия сервера
    registeredAt: { 
        type: Number, 
        default: Date.now(),
    },
    notifyGlobalChat: [
        {
            channelID: { type: String }, // Измените тип поля на String для хранения ID канала
            status: { type: Boolean, default: false }, // Используйте тип Boolean для статуса
        }
    ],
});

module.exports = model("Setting", settingSchema);