require('dotenv').config();
const { Client, IntentsBitField} = require('discord.js');
const mongoose = require('mongoose');
const eventHandler = require('./handlers/eventHandler');
const { sheets } = require('./utils/table-91');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.MessageContent,
  ],
});

(async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('♡ Подключение к базе данных - Успешно');

    // Проверка, что аутентификация Google Sheets завершена
    if (sheets) {
      console.log('♡ Подключение к Google API - Успешно');
      eventHandler(client);
      client.login(process.env.TOKEN);
    } else {
      console.log('Ошибка #0002: Не удалось инициализировать Google Sheets.');
    }
  } catch (error) {
    console.log(`Ошибка #0001: ${error}`);
  }
})();
