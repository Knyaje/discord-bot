const { Client, GuildMember } = require('discord.js');
const GuildSettings = require('../../models/GuildSettings');

/**
 *
 * @param {Client} client
 * @param {GuildMember} member
 */
module.exports = async (client, member) => {
  try {
    let guild = member.guild;
    if (!guild) return;

    const autoRole = await GuildSettings.findOne({ guildId: guild.id });
    if (!autoRole || !autoRole.JoinGuildRole || autoRole.JoinGuildRole.enable !== true) return;

    await member.roles.add(autoRole.JoinGuildRole.roleId);
  } catch (error) {
    console.log(`Error giving role automatically: ${error}`);
  }
};