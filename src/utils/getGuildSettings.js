const GuildSettings = require('../models/GuildSettings');

async function getGuildSettings(guildId) {
  try {
    return await GuildSettings.findOne({ guildId });
  } catch (error) {
    console.error(`Error getting guild settings: ${error}`);
    return null;
  }
}

async function updateGuildSettings(guildId, update) {
  try {
    return await GuildSettings.findOneAndUpdate({ guildId }, update, { new: true, upsert: true });
  } catch (error) {
    console.error(`Error updating guild settings: ${error}`);
    return null;
  }
}

module.exports = {
  getGuildSettings,
  updateGuildSettings,
};