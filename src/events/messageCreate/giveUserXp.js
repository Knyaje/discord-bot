const { Client, Message } = require('discord.js');
const calculateLevelXp = require('../../utils/calculateLevelXp');
const Level = require('../../models/Level');
const { getGuildSettings } = require('../../utils/getGuildSettings');
const cooldowns = new Set();

function getRandomXp(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
  if (!message.inGuild() || message.author.bot || cooldowns.has(message.author.id)) return;

  const guildId = message.guild.id;

  try {
    const guildSettings = await getGuildSettings(guildId);

    if (!guildSettings || !guildSettings.levelSystemEnabled) return; // Если система выключена, не даем опыт

    const xpToGive = getRandomXp(1, 10);

    const query = {
      userId: message.author.id,
      guildId: guildId,
    };

    const level = await Level.findOne(query);

    if (level) {
      level.xp += xpToGive;

      if (level.xp > calculateLevelXp(level.level)) {
        level.xp = 0;
        level.level += 1;

        message.channel.send(`${message.member} вы получили новый **Уровень ${level.level}**.`);
      }

      await level.save();
      cooldowns.add(message.author.id);
      setTimeout(() => {
        cooldowns.delete(message.author.id);
      }, 1000);

      //!if level
    } else {
      // Создаем новую запись об уровне
      const newLevel = new Level({
        userId: message.author.id,
        guildId: guildId,
        xp: xpToGive,
      });

      await newLevel.save();
      cooldowns.add(message.author.id);
      setTimeout(() => {
        cooldowns.delete(message.author.id);
      }, 5000);
    }
  } catch (error) {
    console.log(`Error giving xp: ${error}`);
  }
};