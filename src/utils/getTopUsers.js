const Level = require('../models/Level');

async function getTopUsers() {
    try {
        // Вернуть топ пользователей, отсортированных по уровню и опыту
        return await Level.find().sort({ level: 'desc', xp: 'desc' }).limit(20);
    } catch (error) {
        console.error("Ошибка при получении топовых пользователей:", error);
        return null;
    }
}

async function getTopUsersForGuild(guildId) {
    try {
        // Вернуть топ пользователей для конкретного сервера, отсортированных по уровню и опыту
        return await Level.find({ guildId }).sort({ level: 'desc', xp: 'desc' }).limit(20);
    } catch (error) {
        console.error(`Ошибка при получении топовых пользователей для сервера ${guildId}:`, error);
        return null;
    }
}

module.exports = {
    getTopUsers,
    getTopUsersForGuild,
};