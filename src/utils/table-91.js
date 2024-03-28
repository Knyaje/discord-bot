const { EmbedBuilder } = require('discord.js');
const { google } = require('googleapis');
const { RSQ } = require('../../config.json');
const { channelTimers, queue } = require("./activeArrays");

const spreadsheetId = '1DQlQCTuEPFvn7YvB36T83ATZvErnJOG28cYeEylY7qM'; 
const auth = new google.auth.GoogleAuth({
  keyFile: 'mrc-405519-d777a4e9c8a8.json', 
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

const UserBattalion = require("../models/RSQ-UsersBattalions")
const SettingBattalion = require("../models/RSQ-SettingsBattalions")
let isProcessingQueue = false;

async function processQueue(interaction) {
  if (isProcessingQueue || queue.length === 0) {
    return; // Если очередь уже обрабатывается или пуста, просто выходим из функции
  }

  isProcessingQueue = true;

  try {
    // Добавляем задержку в 2 секунды перед началом выполнения
    await new Promise(resolve => setTimeout(resolve, 2000));

    while (queue.length > 0) {
      const currentInteraction = queue[0]; // Получаем первый элемент из очереди
      await processData(currentInteraction);
      }
  } catch (error) {
    console.error(error);
  } finally {
    isProcessingQueue = false;
  }
}

async function processQueueUpdate(interaction) {

  queue.shift(); // Удаляем только после обработки
  // После обработки запроса обновляем сообщения всем пользователям в очереди
  let position = 1;
  for (const interactionToUpdate of queue) {
    if (position === 1 && queue.length > 0) {
      const firstInQueueMessage = new EmbedBuilder()
        .setTitle('Обработка запроса')
        .setColor('#00FF00')
        .setDescription('Вы первый в очереди, обрабатываем ваш запрос...');

      await interactionToUpdate.editReply({ embeds: [firstInQueueMessage] });
    } else {
      const queueMessage = new EmbedBuilder()
        .setTitle('Обработка запроса')
        .setColor('#FFFF00')
        .setDescription(`Ваш запрос на добавление данных обрабатывается. Позиция в очереди: ${position}`);

      await interactionToUpdate.editReply({ embeds: [queueMessage], ephemeral: true });
    }          
    position++; // Увеличиваем позицию в очереди для следующего пользователя
  }
}

async function processData(interaction) {
  try {
    const name = interaction.fields.getTextInputValue('newName');
    const nomber = interaction.fields.getTextInputValue('newNomber');
    const rank = interaction.fields.getTextInputValue('newRank');
    const date = interaction.fields.getTextInputValue('newData');
    const time = interaction.fields.getTextInputValue('newTime');
    let range;
    if (interaction.guildId === RSQ.menuOptions["91-battalion"].BattalionGuildID) {
      range = RSQ.tableList['91-battalion'].usersOsnova;
    } else if (interaction.guildId === RSQ.menuOptions["7-battalion"].BattalionGuildID) {
      range = RSQ.tableList['7-battalion'].usersOsnova;
    } else {
      const embed = new EmbedBuilder()
        .setTitle('Ошибка')
        .setColor('#FF0000')
        .setDescription('Сервер не опознан (#1741)');

      await interaction.editReply({ embeds: embed, ephemeral: true });
      return;
    }
    const setting = await SettingBattalion.findOne({ guildID: interaction.guild.id });
    const nameBD = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: range,
    });

    const existingValues = nameBD.data.values || [];

    const existingCallsign = existingValues.find(row => row[1] === name);

    const logChannel = interaction.guild.channels.cache.get(setting.channelID.reestrLog.newDelo);
    
    if (existingCallsign) {
      const embedLog = new EmbedBuilder()
        .setTitle('Ошибка')
        .setColor('#FF0000')
        .setDescription(`Кто-то попытался зарегестрировать новый позывной, но он уже имеется в **таблице**\n\n**Запрошенный позывной**\n${name}\n\n**Пользователь**\n<@${interaction.user.id}>`);
    
      await logChannel.send({ embeds: [embedLog], ephemeral: false });

      const embedMessageFalse = new EmbedBuilder()
        .setTitle('Ошибка')
        .setColor('#FF0000')
        .setDescription('Позывной уже существует в таблице');
      
      await processQueueUpdate(interaction);
      return interaction.editReply({ embeds: [embedMessageFalse], ephemeral: false });
    } else {

      const validRanks = ['CR', 'CT', 'PVT', 'PFC', 'CS', 'CPL', 'SGT', 'SSG', 'SPSG', 'LT', 'SLT', 'SPLT', 'CPT'];
      const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/;
      const validFime = ['0', '+1', '+2', '+3', '+4', '+5', '+6', '+7', '+8', '-1', '-2', '-3', '-4', '-5', '-6', '-7', '-8'];
      const existingRecord = await UserBattalion.findOne({ name });

      if (existingRecord) {
        const embedLog = new EmbedBuilder()
          .setTitle('Ошибка')
          .setColor('#FF0000')
          .setDescription(`Кто-то попытался зарегестрировать новый позывной, но он уже имеется в **базе данных**\n\n**Запрошенный позывной**\n${name}\n\n**Пользователь**\n<@${interaction.user.id}>`);
      
        await logChannel.send({ embeds: [embedLog], ephemeral: false });

        const embedMessageError = new EmbedBuilder()
          .setTitle('Ошибка')
          .setColor('#FF0000')
          .setDescription('Позывной уже существует в базе данных');

        await processQueueUpdate(interaction);
        return interaction.editReply({ embeds: [embedMessageError], ephemeral: false });
      }

      if (!validRanks.includes(rank)) {
        const embedMessageError = new EmbedBuilder()
          .setColor('#FF0000')
          .setDescription('Пожалуйста, введите корректное звание (CT, PVT, PFC, CS, CPL и т.д.)');

        await processQueueUpdate(interaction);
        return interaction.editReply({ embeds: [embedMessageError], ephemeral: false });
      }

      if (!validFime.includes(time)) {
        const embedMessageError = new EmbedBuilder()
          .setColor('#FF0000')
          .setDescription('Пожалуйста, введите корректное время МСК (введите 0 если у вас время МСК, или же +1, +2, -1, -2 от МСК в зависимости от вашего времени)');

        await processQueueUpdate(interaction);
        return interaction.editReply({ embeds: [embedMessageError], ephemeral: false });
      }

      if (!dateRegex.test(date)) {
        const errorEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setDescription('Вы ввели некорректный формат даты. Пожалуйста, введите дату в формате ДД.ММ.ГГГГ *(пример 09.09.2023)*');

        await processQueueUpdate(interaction);
        return interaction.editReply({ embeds: [errorEmbed], ephemeral: false });
      }

      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate() < 10 ? '0' : ''}${currentDate.getDate()}.${(currentDate.getMonth() + 1) < 10 ? '0' : ''}${currentDate.getMonth() + 1}.${currentDate.getFullYear()} | ${currentDate.getHours() < 10 ? '0' : ''}${currentDate.getHours()}:${currentDate.getMinutes() < 10 ? '0' : ''}${currentDate.getMinutes()}`;
      const modifiedArray = (time === '0') ? 'МСК' : `МСК (${time})`;
      
      let spec;
      let struc;
      const bso = '➖';
      const squad = '➖';
      const job = '➖';

      if (interaction.guildId === RSQ.menuOptions["91-battalion"].BattalionGuildID) {
        spec = 'BT';
        struc = '91';
      } else if (interaction.guildId === RSQ.menuOptions["7-battalion"].BattalionGuildID) {
        spec = 'Test';
        struc = '7';
      } else {
        const embed = new EmbedBuilder()
          .setTitle('Ошибка')
          .setColor('#FF0000')
          .setDescription('Сервер не опознан (#1741)');
  
        await interaction.editReply({ embeds: embed, ephemeral: true });
        return;
      }

      const newRecord = new UserBattalion({
        guildId: interaction.guild.id,
        guildName: interaction.guild.name,
        name,
        userId: interaction.user.id,
        structure: struc,
        info: {
          number: nomber,
          rank,
          spec,
          bso,
          squad,
          job,
          timeMoscow: time,
          dateRankUP: date,
          dateV: date
        }
      });
      
      await newRecord.save();

      let emptyRow = existingValues.findIndex(row => !row.some(cell => !cell));
      if (emptyRow === -1) {
        // Если не удалось найти пустую строку, то добавляем новые данные в конец таблицы
        emptyRow = existingValues.length;
      }
      
      existingValues[emptyRow] = [
        formattedDate, name, interaction.user.id, String(nomber), rank, spec, bso, modifiedArray, squad, job, date, date, undefined, undefined, undefined, name, interaction.user.id, '0', '0', '0', '0', undefined, undefined, undefined, undefined, name, interaction.user.id, '0', '0', '0', undefined, undefined, undefined, undefined, name, interaction.user.id, '0', '0', '0'
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: range,
        valueInputOption: 'RAW',
        resource: { values: existingValues },
      }); 

      const embedMessageSucces = new EmbedBuilder()
        .setTitle('Дело успешно зарегестрировано')
        .setColor('#910000')
        .addFields({ name: `Данные`, value: `⁣ Номер: *${nomber}*\n⁣ Позывной: *${name}*\n⁣ Звание: *${rank}*\n⁣ Специализация: *${spec}*`})
        .addFields({ name: `Положение`, value: `⁣ БСО: *${bso}*\n⁣ Время МСК: *${modifiedArray}*\n⁣ Отряд: *${squad}*\n⁣ Должность: *${job}*`})
        .addFields({ name: `Другое`, value: `⁣ Дата приема: *${date}*\n⁣ Последнее повышение: *${date}*`})
        .setFooter({ text: '📝 Основной реестр' });

      if (!setting) {
        // Если guildID не был найден, добавляем новую запись в базу данных
        const newSetting = new SettingBattalion({
          guildID: interaction.guild.id,
          guildName: interaction.guild.name
        });
        await newSetting.save();
      }

      // Проверяем, существует ли setting и newDelo не равен false
      if (setting && setting.channelID.reestrLog.newDelo !== 'false') {
        // Получаем ID канала из настроек
        const logChannelId = setting.channelID.reestrLog.newDelo;
        const logChannel = interaction.guild.channels.cache.get(logChannelId);
      
        // Проверяем, существует ли канал с указанным ID
        if (logChannel) {
          const embedLog = new EmbedBuilder()
            .setTitle('Зарегестрировано новое дело')
            .setColor('#910000')
            .setDescription(`**Пользователь:** <@${interaction.user.id}>`)
            .addFields({ name: `Данные`, value: `⁣ Номер: *${nomber}*\n⁣ Позывной: *${name}*\n⁣ Звание: *${rank}*`})
            .addFields({ name: `Положение`, value: `⁣ Время МСК: *${modifiedArray}*`})
            .addFields({ name: `Другое`, value: `⁣ Дата приема: *${date}*\n⁣ Последнее повышение: *${date}*`})
            .setFooter({ text: '📝 Основной реестр' });

          await logChannel.send({ embeds: [embedLog], ephemeral: false });
        } else {
          console.error(`Канал с ID ${logChannelId} не найден`);
        }
      }

      await interaction.editReply({ embeds: [embedMessageSucces], ephemeral: false });
    }
    await processQueueUpdate(interaction);
    //await processQueue();
  } catch (error) {
      console.error(error);

      const embedErrorMessage = new EmbedBuilder()
        .setTitle('Ошибка')
        .setColor('#FF0000')
        .setDescription('Произошла ошибка #8696');

      interaction.editReply({ embeds: [embedErrorMessage], ephemeral: false });
  }
}

module.exports = {
  spreadsheetId,
  sheets,
  processQueue,
  isProcessingQueue
};