const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const { RSQ } = require('../../config.json');


function getMenuEmbed91() {

  const timeToDeleteChannelMinutes = Math.floor(RSQ.config.timeToDeleteChannel / (1000 * 60));

  const animatedEmoji = '<a:heart_green91:1177312765631795300>';
  const animatedEmoji2 = '<a:heart_red91:1177312769658343514>';
  const animatedEmoji4 = '<a:heart_white91:1177312762347671592>';

  const embed = new EmbedBuilder()
    .setTitle('Меню батальона')
    .setColor('#910000')
    .setDescription(`${animatedEmoji}Учет корпуса - открывает меню взаимодействия с вашей базой данных\n\n${animatedEmoji4}Оформить отчет/рапорт об операции - написать рапорт о прошедшей боевой операции\n\n${animatedEmoji2}Удалить канал - удаляет текущий канал с вашим учетом`)
    .setFooter({ text: `Канал будет удален через ${timeToDeleteChannelMinutes}м с момента его создания`});

  const raport = new ButtonBuilder()
    .setCustomId('raport')
    .setLabel('Оформить отчет/рапорт')
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(false);

  const delo = new ButtonBuilder()
    .setCustomId('deloList')
    .setLabel('Учет корпуса')
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(false);

  const deleteChannel = new ButtonBuilder()
    .setCustomId('deleteChannel')
    .setLabel('Удалить канал')
    .setStyle(ButtonStyle.Danger)
    .setDisabled(false);

  const row = new ActionRowBuilder()
    .addComponents(delo, raport, deleteChannel);

  return { embed, components: [row] };
}

function getMenuEmbed7() {

  const timeToDeleteChannelMinutes = Math.floor(RSQ.config.timeToDeleteChannel / (1000 * 60));

  const animatedEmoji = '<a:heart_green91:1177312765631795300>';
  const animatedEmoji2 = '<a:heart_red91:1177312769658343514>';
  const animatedEmoji4 = '<a:heart_white91:1177312762347671592>';

  const embed = new EmbedBuilder()
    .setTitle('Меню батальона')
    .setColor('#910000')
    .setDescription(`Учет батальона - открывает меню взаимодействия с вашей базой данных\n\nОформить отчет/рапорт об операции - написать рапорт о прошедшей боевой операции\n\nУдалить канал - удаляет текущий канал с вашим учетом`)
    .setFooter({ text: `Канал будет удален через ${timeToDeleteChannelMinutes}м с момента его создания`});

  const raport = new ButtonBuilder()
    .setCustomId('raport')
    .setLabel('Оформить отчет/рапорт')
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(false);

  const delo = new ButtonBuilder()
    .setCustomId('deloList')
    .setLabel('Учет батальона')
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(false);

  const deleteChannel = new ButtonBuilder()
    .setCustomId('deleteChannel')
    .setLabel('Удалить канал')
    .setStyle(ButtonStyle.Danger)
    .setDisabled(false);

  const row = new ActionRowBuilder()
    .addComponents(delo, raport, deleteChannel);

  return { embed, components: [row] };
}

function getInfoDBStructure(user) {

  let structureDescription;
  switch (user.structure) {
    case '7':
      structureDescription = `[7-й батальон Корусантской гвардии](${RSQ.config.GuildInvite['7-battalion']})`;
      break;
    case '91':
      structureDescription = `[91-й разведывательный батальон](${RSQ.config.GuildInvite['91-battalion']})`;
      break;
    default:
      structureDescription = user.structure; // Выводим значение как есть, если не совпадает ни с одним кейсом
  }
  return structureDescription;
}

module.exports = { getMenuEmbed91, getMenuEmbed7, getInfoDBStructure };
