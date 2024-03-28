const { users, testServer, RSQ } = require('../../../config.json');
const { Client, Interaction, EmbedBuilder } = require('discord.js');
const getLocalCommands = require('../../utils/getLocalCommands');
const GuildSettings = require('../../models/GuildSettings');

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const localCommands = getLocalCommands();

  try {
    const commandObject = localCommands.find(
      (cmd) => cmd.name === interaction.commandName
    );

    if (!commandObject) return;

    //console.log(`Command: ${interaction.commandName}`);
    //console.log(`Command Object: ${JSON.stringify(commandObject)}`);
    //console.log(`Guild Settings: ${JSON.stringify(guildSettings)}`); // Добавлено для проверки

    if (commandObject.devOnly) {
      if (!users.devs.includes(interaction.member.id)) {
        const embed = new EmbedBuilder()
          .setTitle('Ошибка')
          .setColor('#FF0000')
          .setDescription('Только разработчик бота может использовать эту команду.');

        interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }
    }

    if (commandObject.testOnly) {
      if (!(interaction.guild.id === testServer)) {
        console.log('Not in testServer');
        const embed = new EmbedBuilder()
          .setTitle('Ошибка')
          .setColor('#FF0000')
          .setDescription('Эта команда не может быть запущена на этом дискорд сервере.');

        interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }
    }

    if (commandObject.rsq_battalions) {
      if (!RSQ.BattalionGuildsID.includes(interaction.guild.id)) {
        const embed = new EmbedBuilder()
          .setTitle('Ошибка')
          .setColor('#FF0000')
          .setDescription('Эта кастомная команда разработана специально для определенного сервера, вы не можете ей воспользоваться.');

        interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }
    }

    const guildId = interaction.guild.id;

    // Проверяем, включена ли система уровней для текущего сервера
    let guildSettings = await GuildSettings.findOne({ guildId });

    // Если guildSettings не найден, создаем новую запись
    if (!guildSettings) {
      guildSettings = new GuildSettings({
        guildId: guildId,
        guildName: interaction.guild.name,
        levelSystemEnabled: false,
      });
      await guildSettings.save();
    }

    //console.log(`Guild Settings After: ${JSON.stringify(guildSettings)}`); // Добавлено для проверки

    if (commandObject && commandObject.levelsystem && !guildSettings.levelSystemEnabled) {
      const embed = new EmbedBuilder()
        .setTitle('Ошибка')
        .setColor('#FF0000')
        .setDescription(':trophy: Система уровней отключена на этом сервере. Администраторы могут включить его с помощью команды /enablelevelsystem');

      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          const embed = new EmbedBuilder()
            .setTitle('Ошибка')
            .setColor('#FF0000')
            .setDescription('У вас нет нужных прав для выполнения данной команды.');

          interaction.reply({ embeds: [embed], ephemeral: true });
          return;
        }
      }
    }

    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
        const bot = interaction.guild.members.me;

        if (!bot.permissions.has(permission)) {
          const embed = new EmbedBuilder()
            .setTitle('Ошибка')
            .setColor('#FF0000')
            .setDescription('У меня нет нужных прав для выполнения данной команды.');

          interaction.reply({ embeds: [embed], ephemeral: true });
          return;
        }
      }
    }

    await commandObject.callback(client, interaction);
  } catch (error) {
    console.error(`There was an error running this command: ${error}`);
  }
};
