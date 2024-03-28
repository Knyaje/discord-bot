const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { spreadsheetId, sheets, processQueue, isProcessingQueue } = require("../../utils/table-91");
const { queue } = require("../../utils/activeArrays");
const { getMenuEmbed91, getInfoDBStructure } = require("../../utils/RSQ-Menu");
const { RSQ } = require("../../../config.json");
const SettingBattalion = require("../../models/RSQ-SettingsBattalions");
const RaportFight = require("../../models/RSQ-RaportsFight");
const UserBattalion = require("../../models/RSQ-UsersBattalions");

module.exports = async (client, interaction) => {

  const channel = interaction.channel;
  const member = interaction.member;
  const guild = interaction.guild;

  if (interaction.isButton()) {

    // Удалить канал
    if (interaction.customId === 'deleteChannel') {

      try {
      
        await channel.delete();
  
      } catch (error) {
        console.error('Произошла ошибка при удалении канала:', error);
        await interaction.reply('Произошла ошибка при удалении канала. Пожалуйста, попробуйте еще раз.');
      }
    }

    // Модельное окно - Командное меню - исключить (удалить дело)
    if (interaction.customId === 'RSQ_DeleteUser') {

      try {
      
      const modal = new ModalBuilder()
        .setCustomId('RSQ_ModalDeleteUser')
        .setTitle('Удалить дело бойца');
  
      const nameClone = new TextInputBuilder()
        .setCustomId('nameCloneDelete')
        .setLabel("Кого удалить?")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(20)
        .setPlaceholder('Введите позывной (без номера и звания)');
  
      modal.addComponents(
        new ActionRowBuilder().addComponents(nameClone)
      );
  
      await interaction.showModal(modal);
  
      } catch (error) {
        console.error('Произошла ошибка при удалении канала:', error);
        await interaction.reply('Произошла ошибка при удалении канала. Пожалуйста, попробуйте еще раз.');
      }
    }

    // Раскрывающийся список - меню для изменения дела
    if (interaction.customId === 'cloneReestrEdit91') {

      try {
          await interaction.message.delete();
  
          const embedSucces = new EmbedBuilder()
            .setColor('#910000')
            //.setTitle('Авторизация в системе успешна!')
            .setDescription(`Какие изменения требуется внести?`);
  
          const select = new StringSelectMenuBuilder()
            .setCustomId('menuSelectCloneReestrEdit91')
            .setPlaceholder('Что требуется изменить?')
            .addOptions(
              new StringSelectMenuOptionBuilder()
                .setLabel('💢 ┊ Назад в меню')
                .setDescription('Возвращает вас в изначальное меню')
                .setValue('returntomenu91'),
              new StringSelectMenuOptionBuilder()
                .setLabel('📝 ┊ Номер')
                .setDescription('Меняет информацию о вашем номере')
                .setValue('changenumberreestrosn91'),
              new StringSelectMenuOptionBuilder()
                .setLabel('📝 ┊ Звание')
                .setDescription('Меняет информацию о вашем звании')
                .setValue('changerankreestrosn91'),
              new StringSelectMenuOptionBuilder()
                .setLabel('📝 ┊ Специализация')
                .setDescription('Меняет информацию о вашей специализации')
                .setValue('changespecreestrosn91'),
              new StringSelectMenuOptionBuilder()
                .setLabel('📝 ┊ Членство БСО')
                .setDescription('Меняет информацию о вашем членстве в БСО')
                .setValue('changebsoreestrosn91'),
              new StringSelectMenuOptionBuilder()
                .setLabel('📝 ┊ Время МСК')
                .setDescription('Меняет информацию вашего времени МСК')
                .setValue('changetimereestrosn91'),
              new StringSelectMenuOptionBuilder()
                .setLabel('📝 ┊ Отряд')
                .setDescription('Меняет информацию о вашем отряде')
                .setValue('changesquadreestrosn91'),
              new StringSelectMenuOptionBuilder()
                .setLabel('📝 ┊ Должность')
                .setDescription('Меняет информацию о вашей должности')
                .setValue('changedreestrosn91'),
              new StringSelectMenuOptionBuilder()
                .setLabel('📝 ┊ Дата приема')
                .setDescription('Меняет информацию о вашей дате приема')
                .setValue('changedatevreestrosn91'),
              /*new StringSelectMenuOptionBuilder()
                .setLabel('📝 ┊ Дата последнего повышения')
                .setDescription('Меняет информацию о вашей последней дате повышения')
                .setValue('changepreestrosn91'),
              new StringSelectMenuOptionBuilder()
                .setLabel('🤡 ┊ Аватарка')
                .setDescription('Меняет вашу аватарку в таблице')
                .setValue('changeavareestrosn91'),*/
            );
  
          const selectrow = new ActionRowBuilder()
            .addComponents(select);
  
          await channel.send({ embeds: [embedSucces], components: [selectrow], ephemeral: false});
      } catch (error) {
        console.error(`Произошла ошибка (#4615): ${error}`);
  
        const embedErrorMessage = new EmbedBuilder()
            .setTitle('Ошибка')
            .setColor('#FF0000')
            .setDescription('Произошла ошибка при выполнении (#4615)');
  
        interaction.reply({ embeds: [embedErrorMessage], ephemeral: false });
      }
    }

    // Модельное окно - заполнения рапорта о БВ
    if (interaction.customId === 'raportFight') {

      const modal = new ModalBuilder()
        .setCustomId('raportB')
        .setTitle('Рапорт о боевом вылете');
  
      const nameClone = new TextInputBuilder()
        .setCustomId('nameClone')
        .setLabel("Кто докладывает?")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(20)
        .setPlaceholder('Введите позывной (без номера и звания)');
  
      const nameCMDClone = new TextInputBuilder()
        .setCustomId('nameCMDClone')
        .setLabel("Кто командовал на операции?")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(20)
        .setPlaceholder('Введите позывной (без номера и звания)');
  
      const namesGroup = new TextInputBuilder()
        .setCustomId('namesGroup')
        .setLabel("Кто участвовал на операции?")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Введите позывные через запятую (Neyo, Wolfy, Rex)');
  
      const date = new TextInputBuilder()
        .setCustomId('date')
        .setLabel("Дата и время проведения операции")
        .setStyle(TextInputStyle.Short)
        .setValue('00.00.2024 | 00:00')
        .setMaxLength(20)
        .setPlaceholder(`Введите дату в формате 'ДД.ММ.ГГГГ | ЧЧ:ММ'`);
  
      const description = new TextInputBuilder()
        .setCustomId('description')
        .setLabel("Описание операции")
        .setStyle(TextInputStyle.Paragraph);
  
      modal.addComponents(
        new ActionRowBuilder().addComponents(nameClone),
        new ActionRowBuilder().addComponents(nameCMDClone),
        new ActionRowBuilder().addComponents(namesGroup),
        new ActionRowBuilder().addComponents(date),
        new ActionRowBuilder().addComponents(description)
      );
  
      // Отображение модального окна
      await interaction.showModal(modal);
    }

    // Модельное окное - отказ об рапорте БВ
    if (interaction.customId === 'RSQ_rejectRaportFight') {

      const modal = new ModalBuilder()
        .setCustomId('RSQ_RaportFight_injury')
        .setTitle('Причина отказа');
  
      const DZ = new TextInputBuilder()
        .setCustomId('RSQ_ReasonRaportFight')
        .setLabel("Причина отказа")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Распишите/напишите причину вашего отказа');
  
      modal.addComponents(
        new ActionRowBuilder().addComponents(DZ)
      );
  
      // Отображение модального окна
      await interaction.showModal(modal);
    }

    // Модельное окное - изменить аббревиатуры отряда
    if (interaction.customId === 'RSQ_EditSquads') {

      const modal = new ModalBuilder()
        .setCustomId('RSQ_EditSquadsM')
        .setTitle('Отряды подразделения');
  
      const DZ = new TextInputBuilder()
        .setCustomId('RSQ_Squads')
        .setLabel("Аббревиатуры отрядов")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Введите все аббревиатуры ваших отрядов через , (LSQ, LS, WP, HR)');
  
      modal.addComponents(
        new ActionRowBuilder().addComponents(DZ)
      );
  
      // Отображение модального окна
      await interaction.showModal(modal);
    }

    // Модельное окно - создание нового дела
    if (interaction.customId === 'cloneReestrCreate') {

      try {
        const modalName = new ModalBuilder()
          .setCustomId('newnamereestr')
          .setTitle('Регистрация нового дела');
    
        const newName = new TextInputBuilder()
          .setCustomId('newName')
          .setLabel("Ваш позывной")
          .setStyle(TextInputStyle.Short)
          .setMaxLength(10)
          .setMinLength(3)
          .setPlaceholder('Введите позывной');
    
        const newNomber = new TextInputBuilder()
          .setCustomId('newNomber')
          .setLabel("Ваш номер")
          .setStyle(TextInputStyle.Short)
          .setMaxLength(4)
          .setValue('➖')
          .setPlaceholder('Введите ваш номер');
    
        const newRank = new TextInputBuilder()
          .setCustomId('newRank')
          .setLabel("Ваше звание")
          .setStyle(TextInputStyle.Short)
          .setMaxLength(4)
          .setMinLength(2)
          .setPlaceholder('CR, CT, PVT, PFC, CS, CPL и т.д.');
    
        const newData = new TextInputBuilder()
          .setCustomId('newData')
          .setLabel("Дата вступления в корпус")
          .setStyle(TextInputStyle.Short)
          .setMaxLength(10)
          .setMinLength(10)
          .setValue('00.00.2024')
          .setPlaceholder('Введите дату в формате ДД.ММ.ГГГГ');
    
        const newTime = new TextInputBuilder()
          .setCustomId('newTime')
          .setLabel("Ваше время от МСК")
          .setStyle(TextInputStyle.Short)
          .setMaxLength(3)
          .setPlaceholder('Введите 0, если у вас время МСК или +1, +2 и т.д. от МСК');
    
          modalName.addComponents(
          new ActionRowBuilder().addComponents(newName),
          new ActionRowBuilder().addComponents(newNomber),
          new ActionRowBuilder().addComponents(newRank),
          new ActionRowBuilder().addComponents(newData),
          new ActionRowBuilder().addComponents(newTime),
        );
    
        await interaction.showModal(modalName);               
      } catch (error) {
        console.error(`Произошла ошибка (#4545): ${error}`);   
        
        const embedErrorMessage = new EmbedBuilder()
            .setTitle('Ошибка')
            .setColor('#FF0000')
            .setDescription('Произошла ошибка при выполнении (#4545)');
  
        await interaction.reply({ embeds: [embedErrorMessage], ephemeral: true });
      }
    }

    // Модельное окно - рапорт о нарушении/объявлении в розыск
    if (interaction.customId === 'RSQ_Wanted') {

      try {
        const modalName = new ModalBuilder()
          .setCustomId('RSQ_WantedModal')
          .setTitle('Рапорт о нарушении');
    
        const newName = new TextInputBuilder()
          .setCustomId('guardNameModal')
          .setLabel("Ваш позывной")
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Введите позывной вашего персонажа');
    
        const newNomber = new TextInputBuilder()
          .setCustomId('targetNameModal')
          .setLabel("Позывной нарушителя")
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Введите позывной нарушителя');
    
        const newRank = new TextInputBuilder()
          .setCustomId('guardYKModal')
          .setLabel("Пункты нарушений УК ВАР")
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Введите через запятую 1.1.1, 1.2.4, 1.3.1');
    
        const newData = new TextInputBuilder()
          .setCustomId('guardInfoModal')
          .setLabel("Описание")
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Описание ситуации/нарушения');
    
        const newTime = new TextInputBuilder()
          .setCustomId('guardWantedModal')
          .setLabel("Объявить в розыск?")
          .setStyle(TextInputStyle.Short)
          .setMaxLength(1)
          .setPlaceholder('0 - нет | 1 - да');
    
        modalName.addComponents(
          new ActionRowBuilder().addComponents(newName),
          new ActionRowBuilder().addComponents(newNomber),
          new ActionRowBuilder().addComponents(newRank),
          new ActionRowBuilder().addComponents(newData),
          new ActionRowBuilder().addComponents(newTime),
        );
    
        await interaction.showModal(modalName);               
      } catch (error) {
        console.error(`Произошла ошибка (#4545): ${error}`);   
        
        const embedErrorMessage = new EmbedBuilder()
            .setTitle('Ошибка')
            .setColor('#FF0000')
            .setDescription('Произошла ошибка при выполнении (#4545)');
  
        await interaction.reply({ embeds: [embedErrorMessage], ephemeral: true });
      }
    }

    // Модельное окно - пробить по БД исполнительных органов
    if (interaction.customId === 'RSQ_infoViolations') {

      const modal = new ModalBuilder()
        .setCustomId('RSQ_infoViolationsM')
        .setTitle('Пробить');
  
      const guardName = new TextInputBuilder()
        .setCustomId('guardNameModal')
        .setLabel("Ваш позывной")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Введите позывной вашего персонажа');
  
      const targetNomber = new TextInputBuilder()
        .setCustomId('targetNameModal')
        .setLabel("Позывной нарушителя")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Введите позывной нарушителя');  
      
      modal.addComponents(
        new ActionRowBuilder().addComponents(guardName),
        new ActionRowBuilder().addComponents(targetNomber)
      );
  
      // Отображение модального окна
      await interaction.showModal(modal);
    }

    // Взаимодейтсвие с нарушением
    if (interaction.customId === 'RSQ_GuardRaport_FalseWanted' || interaction.customId === 'RSQ_GuardRaport_DeleteWanted' || interaction.customId === 'RSQ_GuardRaport_TrueWanted') {
      try {
          const target = await UserBattalion.findOne({ 'guardInfo.violations.messageId': interaction.message.id });
          if (!target) {
            const embedErrorMessage = new EmbedBuilder()
              .setTitle('Ошибка')
              .setColor('#FF0000')
              .setDescription(`Информация с нарушением, связанным с данным делом, не найдена в базе данных`);
    
            await interaction.reply({ embeds: [embedErrorMessage], ephemeral: true });
            return;
          }
    
          const violationIndex = target.guardInfo.violations.findIndex(violation => violation.messageId === interaction.message.id);
          if (violationIndex === -1) {
            console.error(`Нарушение с сообщением ${interaction.message.id} не найдено в базе данных цели`);
            return;
          }
    

          let updatedEmbed;
          let row;
          if (interaction.customId === 'RSQ_GuardRaport_FalseWanted') {

            target.guardInfo.violations[violationIndex].status = false;
            const violation = target.guardInfo.violations[violationIndex];

            let embedWanted;
            if (violation.wanted === '0') {
              embedWanted = '*Не объявлен*';
            } else if (violation.wanted === '1') {
              embedWanted = '`Объявлен`';
            }

            updatedEmbed = new EmbedBuilder()
              .setAuthor({ name: `📛 Рапорт о нарушении` })
              .setColor('#FF0000')
              .setDescription(`
              **Подозреваемый:** *${violation.targetName}* ||<@${violation.targetId}>||
              \n**Нарушение УК:** *${violation.codex}*\n**Розыск:** ${embedWanted}
              \n**Информация:** \`\`\`${violation.info}\`\`\`
              **Подпись:** *${violation.guardName}* ||<@${violation.guardId}>||
              \n\n**Последний менявший статус:** <@${interaction.user.id}>
              `)
              .setTimestamp()
              .setFooter({ text: `❌ Неактивный`});
    
            const editWanted = new ButtonBuilder()
              .setCustomId('RSQ_GuardRaport_TrueWanted')
              .setLabel('Активный')
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(false);

            const deleteWanted = new ButtonBuilder()
              .setCustomId('RSQ_GuardRaport_DeleteWanted')
              .setLabel('Удалить')
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(false);

            row = new ActionRowBuilder()
              .addComponents(editWanted, deleteWanted);

            const messageToUpdate = await interaction.channel.messages.fetch(interaction.message.id);
            await messageToUpdate.edit({ embeds: [updatedEmbed], components: [row] });
            await interaction.reply({ content: 'Статус успешно изменен', ephemeral: true })

          } else if (interaction.customId === 'RSQ_GuardRaport_TrueWanted') {

            target.guardInfo.violations[violationIndex].status = true;
            const violation = target.guardInfo.violations[violationIndex];

            let embedWanted;
            if (violation.wanted === '0') {
              embedWanted = '*Не объявлен*';
            } else if (violation.wanted === '1') {
              embedWanted = '`Объявлен`';
            }

            updatedEmbed = new EmbedBuilder()
              .setAuthor({ name: `📛 Рапорт о нарушении` })
              .setColor('#FF0000')
              .setDescription(`
              **Подозреваемый:** *${violation.targetName}* ||<@${violation.targetId}>||
              \n**Нарушение УК:** *${violation.codex}*\n**Розыск:** ${embedWanted}
              \n**Информация:** \`\`\`${violation.info}\`\`\`
              **Подпись:** *${violation.guardName}* ||<@${violation.guardId}>||
              \n\n**Последний менявший статус:** <@${interaction.user.id}>
              `)
              .setTimestamp()
              .setFooter({ text: `✔️ Активен`});
    
            const editWanted = new ButtonBuilder()
              .setCustomId('RSQ_GuardRaport_FalseWanted')
              .setLabel('Не активный')
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(false);

            const deleteWanted = new ButtonBuilder()
              .setCustomId('RSQ_GuardRaport_DeleteWanted')
              .setLabel('Удалить')
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(false);

            row = new ActionRowBuilder()
              .addComponents(editWanted, deleteWanted);

            const messageToUpdate = await interaction.channel.messages.fetch(interaction.message.id);
            await messageToUpdate.edit({ embeds: [updatedEmbed], components: [row] });
            await interaction.reply({ content: 'Статус успешно изменен', ephemeral: true })

          } else if (interaction.customId === 'RSQ_GuardRaport_DeleteWanted') {
            
            updatedEmbed = new EmbedBuilder()
              //.setAuthor({ name: `📛 Рапорт о нарушении` })
              .setColor('#000100')
              .setDescription(`
              \`\`\`Данные о нарушении были удалены\n\`\`\`**Инициатор:** <@${interaction.user.id}>`)
              .setTimestamp()
              .setFooter({ text: `🗑️ Удален`});

            const messageToUpdate = await interaction.channel.messages.fetch(interaction.message.id);
            await messageToUpdate.edit({ embeds: [updatedEmbed], components: [] });

            target.guardInfo.violations.splice(violationIndex, 1);
          }
    
          await target.save();
      } catch (error) {
        console.error('Произошла ошибка #7197:', error);
        const embedErrorMessage = new EmbedBuilder()
          .setTitle('Ошибка')
          .setColor('#FF0000')
          .setDescription('Произошла ошибка при выполнении команды (#7197)');
  
        await interaction.reply({ embeds: [embedErrorMessage], ephemeral: true });
      }
    }

    // Переключить частоты (меню)
    if (interaction.customId === 'RSQ_EditRadio') {

      const embed = new EmbedBuilder()
        .setColor('#FFFFFF')
        .setDescription(`Установите новую частоту`);

      const select = new StringSelectMenuBuilder()
        .setCustomId('RSQ_EditRadioMB')
        .setPlaceholder('Выберите новую частоту')
        .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel(' ┊ ALPHA')
          .setDescription('Возвращает вас в изначальное меню')
          .setValue('radio1'),
        new StringSelectMenuOptionBuilder()
          .setLabel(' ┊ BRAVO')
          .setDescription('Меняет информацию о вашем номере')
          .setValue('radio2'),
        new StringSelectMenuOptionBuilder()
          .setLabel(' ┊ DELTA')
          .setDescription('Меняет информацию о вашем звании')
          .setValue('radio3'),
        new StringSelectMenuOptionBuilder()
          .setLabel(' ┊ ULTIMA')
          .setDescription('Меняет информацию о вашей специализации')
          .setValue('radio4'),
        new StringSelectMenuOptionBuilder()
          .setLabel(' ┊ RENO')
          .setDescription('Меняет информацию о вашем членстве в БСО')
          .setValue('radio5'),
      );

      const selectrow = new ActionRowBuilder()
        .addComponents(select);

      await interaction.reply({ embeds: [embed], components: [selectrow], ephemeral: true });
    }
  }

  // Принятие рапорта о БВ
  if (interaction.isButton() && interaction.customId === 'RSQ_approveRaportFight' || interaction.isModalSubmit() && interaction.customId === 'RSQ_RaportFight_injury') {
    
    try {
      const raportFight = await RaportFight.findOne({ moderatorMessageId: interaction.message.id });
    
      let reason;
      if (interaction.isModalSubmit() && interaction.customId === 'RSQ_RaportFight_injury') {
        reason = interaction.fields.getTextInputValue('RSQ_ReasonRaportFight');
      }

      if (!raportFight) {
        return await interaction.reply({ content: 'Данные не найдены.', ephemeral: true });
      }

      const guild = interaction.guild;

      const moderatorChannel = guild.channels.cache.get(raportFight.moderatorChannelId);
      if (!moderatorChannel) {
        return await interaction.reply({ content: 'Канал модератора не найден.', ephemeral: true });
      }

      const moderatorMessage = await moderatorChannel.messages.fetch(raportFight.moderatorMessageId);
      if (!moderatorMessage) {
        return await interaction.reply({ content: 'Сообщение модератора не найдено.', ephemeral: true });
      }

      const userChannel = guild.channels.cache.get(raportFight.userChannelId);
      if (!userChannel) {
        return await interaction.reply({ content: 'Канал пользователя не найден.', ephemeral: true });
      }

      const userMessage = await userChannel.messages.fetch(raportFight.userMessageId);
      if (!userMessage) {
        return await interaction.reply({ content: 'Сообщение пользователя не найдено.', ephemeral: true });
      }

      const commander = raportFight.commander;
      const clone = raportFight.reporter;
      const group = raportFight.group;
      const reportNumber = raportFight.reportNumber;
      const dateOP = raportFight.date;
      const description = raportFight.operationDescription;
      let date = raportFight.date;
      
      date = date.split(' | ')[0];

      if (interaction.isButton() && interaction.customId === 'RSQ_approveRaportFight') {
        // Обновление данных для каждого участника группы
        for (const member of group) {
          const user = await UserBattalion.findOne({ name: member.name });
          if (user) {
            // Получение данных из Google Таблицы
            const range = '7th Table | Users!Q4:Q'; // Диапазон для поиска имен
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range,
            });
            const values = response.data.values.flat(); // Преобразование двумерного массива в одномерный

            // Проверка совпадений и обновление значений
            const index = values.indexOf(member.name);
            if (index !== -1) {
              const rowToUpdate = index + 4; // Первая строка таблицы начинается с 1, поэтому добавляем 4
              const rangeToUpdate = `T${rowToUpdate}`;
              const rangeToUpdate2 = `U${rowToUpdate}`;
              const responseT = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: rangeToUpdate,
              });
              const responseT2 = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: rangeToUpdate2,
              });
              const currentValue = parseInt(responseT.data.values[0][0]) || 0;
              const currentValue2 = parseInt(responseT2.data.values[0][0]) || 0;
              const valueToUpdate = [[currentValue + 1]];
              const valueToUpdate2 = [[currentValue2 + 1]];

              try {
                await sheets.spreadsheets.values.update({
                  spreadsheetId,
                  range: rangeToUpdate,
                  valueInputOption: 'RAW',
                  requestBody: { values: valueToUpdate },
                });
                await sheets.spreadsheets.values.update({
                  spreadsheetId,
                  range: `W${rowToUpdate}`,
                  valueInputOption: 'RAW',
                  requestBody: { values: [[date]] }, // Обновляем значение в ячейке на значение переменной date
                });
                if (user.info.rank === member.rank) {
                  await sheets.spreadsheets.values.update({
                    spreadsheetId,
                    range: rangeToUpdate2,
                    valueInputOption: 'RAW',
                    requestBody: { values: valueToUpdate2 },
                  });
                }
              } catch (error) {
                console.error('Произошла ошибка при обновлении значения в Google Таблице:', error);
              }
            }
            // Обновление данных пользователя
            user.battle.fight = (parseInt(user.battle.fight) + 1).toString();
            if (user.info.rank === member.rank) {
              user.battle.fightForRank = (parseInt(user.battle.fightForRank) + 1).toString();
            }
            // Присвоение значения date в lastDateFight
            user.battle.lastDateFight = date;
            await user.save();
          }
        }

        const commanderUser = await UserBattalion.findOne({ name: commander.name });

        if (commanderUser) {
          // Получение данных из Google Таблицы
          const range = '7th Table | Users!Q4:Q'; // Диапазон для поиска имен
          const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
          });
          const values = response.data.values.flat(); // Преобразование двумерного массива в одномерный
      
          // Проверка совпадений и обновление значений
          const index = values.indexOf(commander.name);
          if (index !== -1) {
            const rowToUpdate = index + 4; // Первая строка таблицы начинается с 1, поэтому добавляем 4
            const rangeToUpdate = `S${rowToUpdate}`;
            const responseS = await sheets.spreadsheets.values.get({
              spreadsheetId,
              range: rangeToUpdate,
            });
            const currentValue = parseInt(responseS.data.values[0][0]) || 0;
            const valueToUpdate = [[currentValue + 1]];

            try {
              await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: rangeToUpdate,
                valueInputOption: 'RAW',
                requestBody: { values: valueToUpdate },
              });
            } catch (error) {
              console.error('Произошла ошибка #7753:', error);
            }
          }
      
          // Обновление данных командира в базе данных
          commanderUser.battle.commandFight = (parseInt(commanderUser.battle.commandFight) + 1).toString();
          await commanderUser.save();
        }
      }

      const embedToChannel = new EmbedBuilder()
        .setAuthor({ name: 'Статус: 👀', iconURL: 'https://cdn.discordapp.com/icons/981509661926785064/a_59b054b674dcdc19922b7574bc16b284.webp?size=96' })
        .setTitle(`Рапорт о боевом вылете №${reportNumber}`)
        .setColor('#3498db')
        .setDescription(`Докладывает *${clone.rank} ${clone.number} ${clone.name}* ||<@${clone.id}>|| о боевом вылете №${reportNumber}\n\n**Командир:** *${commander.rank} ${commander.number} ${commander.name} ||<@${commander.id}>||*\n**Дата и время операции:** ${date}\n\n**Состав:** ${group.map(member => `\n*${member.rank} ${member.number} ${member.name}* ||<@${member.id}>||`)}\n\n**Ход операции**\n ${description}`)
        .setTimestamp();

      await moderatorMessage.edit({ embeds: [embedToChannel], components: [] });

      const embedAnswersUser = new EmbedBuilder()
        .setAuthor(interaction.customId === 'RSQ_approveRaportFight' ? { name: 'Статус: ✔️', iconURL: 'https://cdn.discordapp.com/icons/981509661926785064/a_59b054b674dcdc19922b7574bc16b284.webp?size=96' } : { name: 'Статус: ❌', iconURL: 'https://cdn.discordapp.com/icons/981509661926785064/a_59b054b674dcdc19922b7574bc16b284.webp?size=96' })
        .setTitle(`Рапорт о боевом вылете №${reportNumber}`)
        .setColor(interaction.customId === 'RSQ_approveRaportFight' ? '#32a852' : '#FF0000')
        .setDescription(`Докладывает *${clone.rank} ${clone.number !== '➖' ? ' ' + clone.number : ''} ${clone.name}* ||<@${clone.id}>|| о боевом вылете №${reportNumber}\n\n**Командир:** *${commander.rank} ${commander.number !== '➖' ? ' ' + commander.number : ''} ${commander.name}* ||<@${commander.id}>||\n**Дата и время операции:** ${dateOP}\n\n**Состав:** ${group.map(member => {
          let description = `\n*${member.rank}`;
          if (member.number !== '➖') {
              description += ` ${member.number}`;
          }
          description += ` ${member.name}* ||<@${member.id}>||`;
          return description;
        })}\n\n**Ход операции**\n ${description}${interaction.customId === 'RSQ_approveRaportFight' ? `` : `\n\n**Причина отказа:** ${reason}`}`)
        .setTimestamp();

      await userMessage.edit({ embeds: [embedAnswersUser], components: [] });

      const embedAnswersModerator = new EmbedBuilder()
        .setAuthor(interaction.customId === 'RSQ_approveRaportFight' ? { name: 'Статус: ✔️', iconURL: 'https://cdn.discordapp.com/icons/981509661926785064/a_59b054b674dcdc19922b7574bc16b284.webp?size=96' } : { name: 'Статус: ❌', iconURL: 'https://cdn.discordapp.com/icons/981509661926785064/a_59b054b674dcdc19922b7574bc16b284.webp?size=96' })
        .setTitle(`Рапорт о боевом вылете №${reportNumber}`)
        .setColor(interaction.customId === 'RSQ_approveRaportFight' ? '#32a852' : '#FF0000')
        .setDescription(`Докладывает *${clone.rank} ${clone.number !== '➖' ? ' ' + clone.number : ''} ${clone.name}* ||<@${clone.id}>|| о боевом вылете №${reportNumber}\n\n**Командир:** *${commander.rank} ${commander.number !== '➖' ? ' ' + commander.number : ''} ${commander.name}* ||<@${commander.id}>||\n**Дата и время операции:** ${dateOP}\n\n**Состав:** ${group.map(member => {
          let description = `\n*${member.rank}`;
          if (member.number !== '➖') {
            description += ` ${member.number}`;
          }
          description += ` ${member.name}* ||<@${member.id}>||`;
          return description;
        })}\n\n**Ход операции**\n ${description}\n\n${interaction.customId === 'RSQ_approveRaportFight' ? `**Проверил:** ${interaction.user}` : `**Проверил:** ${interaction.user}\n**Причина отказа:** ${reason}`}`)
        .setTimestamp();

      await moderatorMessage.edit({ content: '', embeds: [embedAnswersModerator], components: [] });

      await RaportFight.deleteOne({ _id: raportFight._id });

      const sucessEmbed = new EmbedBuilder()
        .setColor('#910000')
        .setDescription(interaction.customId === 'RSQ_approveRaportFight' ? 'Рапорт успешно одобрен' : 'Рапорт успешно отклонен')
    } catch (error) {
      await console.error('Произошла ошибка #7548:', error);
    }
  }

  if (interaction.isStringSelectMenu() && interaction.customId === 'RSQ_EditRadioMB') {
    const settings = await SettingBattalion.findOne({ guildID: interaction.guildId });
    const selectedValue = interaction.values[0];
    const radioChannelId = settings.channelID.baseMessage.channel; // ID канала, куда отправлять сообщение
    const radioMessageId = settings.channelID.baseMessage.message; // ID существующего сообщения, если есть

    // Маппинг значений из списка на значения в базе данных
    const radioValuesMap = {
      'radio1': settings.radioConnection.numberRadio.radio1,
      'radio2': settings.radioConnection.numberRadio.radio2,
      'radio3': settings.radioConnection.numberRadio.radio3,
      'radio4': settings.radioConnection.numberRadio.radio4,
      'radio5': settings.radioConnection.numberRadio.radio5,
    };

    // Получаем значение, соответствующее выбранной частоте
    const newActualRadioValue = radioValuesMap[selectedValue];

    try {
      // Обновляем поле actualRadio в базе данных
      await SettingBattalion.updateOne({ guildID: interaction.guildId }, { $set: { 'radioConnection.actualRadio': newActualRadioValue } });
      
    } catch (error) {
      console.error('Ошибка при обновлении значения actualRadio:', error);
      await interaction.reply({ content: "Произошла ошибка при обновлении частоты.", ephemeral: true }); 
    }

    const embedMessage = await createEmbedMessage(selectedValue, settings);

    if (radioChannelId !== "false") {
      if (radioMessageId !== 'false') {
        const radioChannel = interaction.guild.channels.cache.get(radioChannelId);
        const radioMessage = await radioChannel.messages.fetch(radioMessageId);
        await radioMessage.edit({ embeds: [embedMessage] });
      } else {
        const radioChannel = interaction.guild.channels.cache.get(radioChannelId);
        const sentMessage = await radioChannel.send({ embeds: [embedMessage] });
        const newMessageId = sentMessage.id;

        // Обновление ID сообщения в базе данных
        await SettingBattalion.findOneAndUpdate({ guildID: interaction.guild.id }, { 'channelID.baseMessage.message': newMessageId });
      }
    } else {
      await interaction.reply({ content: 'Канал штаба не назначен', ephemeral: true });
      return;
    }

    // Отправка ответа взаимодействию
    await interaction.reply({ content: "Частота успешно обновлена.", ephemeral: true });    
  }

  if (interaction.isStringSelectMenu() && interaction.customId === 'menuSelectCloneReestrEdit91') {
    const selectedValue = interaction.values[0];

    // Назад в меню
    if (selectedValue === 'returntomenu91') {

      await interaction.message.delete();

      const { embed, components } = getMenuEmbed91();

      await await interaction.channel.send({ embeds: [embed], components: components, ephemeral: false });

    }

    // Изменить номер
    if (selectedValue === 'changenumberreestrosn91') {
      const modal = new ModalBuilder()
        .setCustomId('RSQ_EditUserNomber')
        .setTitle('Изменить номер');

      const nameClone = new TextInputBuilder()
        .setCustomId('nameClone')
        .setLabel("Введите ваш позывной")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(20)
        .setPlaceholder('Введите позывной (без номера и звания)');

      const editNomber = new TextInputBuilder()
        .setCustomId('editNomber')
        .setLabel("Ваш номер")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(4)
        .setValue('➖')
        .setPlaceholder('Введите ваш номер');

      modal.addComponents(
        new ActionRowBuilder().addComponents(nameClone),
        new ActionRowBuilder().addComponents(editNomber)
      );

      await interaction.showModal(modal);
    }

    // Изменить звание
    if (selectedValue === 'changerankreestrosn91') {
      const modal = new ModalBuilder()
        .setCustomId('RSQ_EditUserRank')
        .setTitle('Изменить звание');

      const nameClone = new TextInputBuilder()
        .setCustomId('nameClone')
        .setLabel("Введите ваш позывной")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(20)
        .setPlaceholder('Введите позывной (без номера и звания)');

      const editRank = new TextInputBuilder()
        .setCustomId('editRank')
        .setLabel("Ваше новое звание")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(4)
        .setMinLength(2)
        .setPlaceholder('CR, CT, PVT, PFC, CS, CPL и т.д.');

      const editData = new TextInputBuilder()
        .setCustomId('editData')
        .setLabel("Дата повышения")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(10)
        .setMinLength(10)
        .setValue('00.00.2024')
        .setPlaceholder('Введите дату в формате ДД.ММ.ГГГГ');

      modal.addComponents(
        new ActionRowBuilder().addComponents(nameClone),
        new ActionRowBuilder().addComponents(editRank),
        new ActionRowBuilder().addComponents(editData)
      );

      await interaction.showModal(modal);
    }

    // Изменить время МСК
    if (selectedValue === 'changetimereestrosn91') {
      const modal = new ModalBuilder()
        .setCustomId('RSQ_EditUserTimeM')
        .setTitle('Изменить время МСК');

      const nameClone = new TextInputBuilder()
        .setCustomId('nameClone')
        .setLabel("Введите ваш позывной")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(20)
        .setPlaceholder('Введите позывной (без номера и звания)');

      const editTime = new TextInputBuilder()
        .setCustomId('editTime')
        .setLabel("Ваше время от МСК")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(3)
        .setPlaceholder('Введите 0, если у вас время МСК или +1, +2 и т.д. от МСК');


      modal.addComponents(
        new ActionRowBuilder().addComponents(nameClone),
        new ActionRowBuilder().addComponents(editTime)
      );

      await interaction.showModal(modal);
    }

    // Изменить отряд
    if (selectedValue === 'changesquadreestrosn91') {
      const modal = new ModalBuilder()
        .setCustomId('RSQ_EditUserSquad')
        .setTitle('Изменить отряд');

      const nameClone = new TextInputBuilder()
        .setCustomId('nameClone')
        .setLabel("Введите ваш позывной")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(20)
        .setPlaceholder('Введите позывной (без номера и звания)');

      const editSquad = new TextInputBuilder()
        .setCustomId('editSquad')
        .setLabel("Отряд")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(3)
        .setPlaceholder('Введите аббревиатуру вашего отряда');


      modal.addComponents(
        new ActionRowBuilder().addComponents(nameClone),
        new ActionRowBuilder().addComponents(editSquad)
      );

      await interaction.showModal(modal);
    }

    // Изменить должность
    if (selectedValue === 'changedreestrosn91') {
      const modal = new ModalBuilder()
        .setCustomId('RSQ_EditUserBog')
        .setTitle('Изменить должность');

      const nameClone = new TextInputBuilder()
        .setCustomId('nameClone')
        .setLabel("Введите ваш позывной")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(20)
        .setPlaceholder('Введите позывной (без номера и звания)');

      modal.addComponents(
        new ActionRowBuilder().addComponents(nameClone)
      );

      await interaction.showModal(modal);
    }

    // Изменить спец-ию
    if (selectedValue === 'changespecreestrosn91') {
      const modal = new ModalBuilder()
        .setCustomId('RSQ_EditUserSpec')
        .setTitle('Изменить спец-ию');

      const nameClone = new TextInputBuilder()
        .setCustomId('nameClone')
        .setLabel("Введите ваш позывной")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(20)
        .setPlaceholder('Введите позывной (без номера и звания)');

      const editSpec = new TextInputBuilder()
        .setCustomId('editSpec')
        .setLabel("Членство БСО")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(3)
        .setPlaceholder('BT, ABT, RT, ART, BM, BMI, BMS, BSM');


      modal.addComponents(
        new ActionRowBuilder().addComponents(nameClone),
        new ActionRowBuilder().addComponents(editSpec)
      );

      await interaction.showModal(modal);
    }

    // Изменить БСО
    if (selectedValue === 'changebsoreestrosn91') {
      const modal = new ModalBuilder()
        .setCustomId('RSQ_EditUserBso')
        .setTitle('Изменить членство БСО');

      const nameClone = new TextInputBuilder()
        .setCustomId('nameClone')
        .setLabel("Введите ваш позывной")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(20)
        .setPlaceholder('Введите позывной (без номера и звания)');

      const editBso = new TextInputBuilder()
        .setCustomId('editBso')
        .setLabel("Членство БСО")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(3)
        .setPlaceholder('ARC, ARF или введите 0 если не состоите в БСО');


      modal.addComponents(
        new ActionRowBuilder().addComponents(nameClone),
        new ActionRowBuilder().addComponents(editBso)
      );

      await interaction.showModal(modal);
    }

    // Изменить дату вступления
    if (selectedValue === 'changedatevreestrosn91') {
      const modal = new ModalBuilder()
        .setCustomId('RSQ_EditUserDateV')
        .setTitle('Изменить дату вступления');

      const nameClone = new TextInputBuilder()
        .setCustomId('nameClone')
        .setLabel("Введите ваш позывной")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(20)
        .setPlaceholder('Введите позывной (без номера и звания)');

      const editData = new TextInputBuilder()
        .setCustomId('editData')
        .setLabel("Дата вступления")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(10)
        .setMinLength(10)
        .setValue('00.00.2024')
        .setPlaceholder('Введите дату в формате ДД.ММ.ГГГГ');

      modal.addComponents(
        new ActionRowBuilder().addComponents(nameClone),
        new ActionRowBuilder().addComponents(editData)
      );

      await interaction.showModal(modal);
    }
  }

  if (interaction.isModalSubmit() && interaction.customId === 'RSQ_ModalDeleteUser' ) {

    try {
      const name = interaction.fields.getTextInputValue('nameCloneDelete');

      const user = await UserBattalion.findOne({ name });

      if (!user) {
        const embedErrorMessage = new EmbedBuilder()
          .setTitle('Ошибка')
          .setColor('#FF0000')
          .setDescription('Пользователь не найден');
        await interaction.reply({ embeds: [embedErrorMessage], ephemeral: true });
        return;
      }

      // Проверьте, соответствует ли структура сервера структуре пользователя
      if (interaction.guildId === RSQ.menuOptions['91-battalion'].BattalionGuildID && user.structure !== '91') {
        const embedErrorMessage = new EmbedBuilder()
          .setTitle('Ошибка')
          .setColor('#FF0000')
          .setDescription('У вас нет прав на удаление информации о данном пользователе');
        await interaction.reply({ embeds: [embedErrorMessage], ephemeral: true });
        return;
      }

      if (interaction.guildId === RSQ.menuOptions['7-battalion'].BattalionGuildID && user.structure !== '7') {
        const embedErrorMessage = new EmbedBuilder()
          .setTitle('Ошибка')
          .setColor('#FF0000')
          .setDescription('У вас нет прав на удаление информации о данном пользователе');
        await interaction.reply({ embeds: [embedErrorMessage], ephemeral: true });
        return;
      }
      
      const deletedUser = await UserBattalion.findOneAndDelete({ name });

      let regSuccesDB = '';
      let regSuccesGT = '';
      if (deletedUser) {
        regSuccesDB = '*Удалено успешно*'
      } else {
        regSuccesDB = '*Дело не обнаружено*'
      }

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

        await interaction.reply({ embeds: embed, ephemeral: true });
        return;
      }

      const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      console.log(res)

      const rows = res.data.values || [];
      const rowIndex = rows.findIndex(row => row[1] === name);

      if (rowIndex !== -1) {
        const response = await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [{
              deleteDimension: {
                range: {
                  dimension: 'ROWS',
                  startIndex: rowIndex + 3, // С учетом смещения диапазона и заголовков таблицы
                  endIndex: rowIndex + 4 // С учетом смещения диапазона и заголовков таблицы
                }
              }
            }]
          }
        });

        if (response.status === 200) {
          regSuccesGT = '*Удалено успешно*'
        } else {
          regSuccesGT = `*Произошла ошибка:*`, response.statusText
        }   
      } else {
        regSuccesGT = '*Дело не обнаружено*'
      }

      const embedSucces = new EmbedBuilder()
        .setColor('#910000')
        .setDescription(`**База данных:** ${regSuccesDB}\n**Google таблица:** ${regSuccesGT}`);
      
      await interaction.reply({ embeds: [embedSucces], ephemeral: true });
    } catch(error) {
      console.error(`Произошла ошибка (#7245): ${error}`);
    }
  }

  if (interaction.isModalSubmit() && interaction.customId === 'RSQ_WantedModal' ) {
    const guardName = interaction.fields.getTextInputValue('guardNameModal');
    const targetName = interaction.fields.getTextInputValue('targetNameModal');
    const guardYK = interaction.fields.getTextInputValue('guardYKModal');
    const guardInfo = interaction.fields.getTextInputValue('guardInfoModal');
    const guardWanted = interaction.fields.getTextInputValue('guardWantedModal');

    if (guardWanted !== '0' && guardWanted !== '1') {
      const embedInvalidValue = new EmbedBuilder()
        .setTitle('Ошибка')
        .setColor('#FF0000')
        .setDescription('Указано неверное значение для 5 пункта');

      await interaction.reply({ embeds: [embedInvalidValue], ephemeral: true });
      return;
    }

    try {
      const guard = await UserBattalion.findOne({ name: guardName });
      if (!guard) {
        const embedNotFound = new EmbedBuilder()
          .setTitle('Ошибка')
          .setColor('#FF0000')
          .setDescription(`Дело с позывным "*${guardName}*" не найдено в базе данных`);

        await interaction.reply({ embeds: [embedNotFound], ephemeral: true });
        return;
      }

      if (!guard || guard.userId !== interaction.member.id) {
        const embedNotFound = new EmbedBuilder()
          .setTitle('Ошибка')
          .setColor('#FF0000')
          .setDescription(`У вас нет прав на отправку рапорта от имени этого пользователя`);

        await interaction.reply({ embeds: [embedNotFound], ephemeral: true });
        return;
      }

      if (!guard.config.wantedSet) {
        const embedAccessDenied = new EmbedBuilder()
          .setTitle('Ошибка')
          .setColor('#FF0000')
          .setDescription(`У вас нет соответствующего доступа к реестру исполнительных органов`);

        await interaction.reply({ embeds: [embedAccessDenied], ephemeral: true });
        return;
      }

      const target = await UserBattalion.findOne({ name: targetName });
      if (!target) {
        const embedNotFound = new EmbedBuilder()
          .setTitle('Ошибка')
          .setColor('#FF0000')
          .setDescription(`Дело с позывным "*${targetName}*" не найдено в базе данных`);

        await interaction.reply({ embeds: [embedNotFound], ephemeral: true });
        return;
      }

      const setting = await SettingBattalion.findOne({ guildID: interaction.guild.id });
      if (!setting || !setting.channelID.wantedRaport.channel) {
        console.error(`Не удалось определить канал ${interaction.guild.id}`);
        return;
      }

      const targetChannel = interaction.guild.channels.cache.get(setting.channelID.wantedRaport.channel);
      if (!targetChannel) {
        console.error(`Текстовый канал с ID ${setting.channelID.wantedRaport.channel} не найден`);
        
        const embedErrorMessage = new EmbedBuilder()
          .setTitle('Ошибка')
          .setColor('#FF0000')
          .setDescription('Текстовый канал не назначен или не был найден (#7187)');

        await interaction.reply({ embeds: [embedErrorMessage], ephemeral: true });

        return;
      }

      let embedWanted;

      if (guardWanted === '0') {
        embedWanted = '*Не объявлен*';
      } else if (guardWanted === '1') {
        embedWanted = '`Объявлен`';
      }

      const numberGuard = /^\d{4}$/.test(guard.info.number) ? guard.info.number : '';
      const numberTarget = /^\d{4}$/.test(target.info.number) ? target.info.number : '';

      const guardInfoUser = {
        id: guard.userId,
        info: `${guard.info.rank} ${numberGuard} ${guardName}`
      };

      const targetInfoUser = {
        id: target.userId,
        info: `${target.info.rank} ${numberTarget} ${targetName}`
      };

      const embedMessage = new EmbedBuilder()
        .setAuthor({ name: `📛 Рапорт о нарушении` })
        .setColor('#FF0000')
        .setDescription(`
        **Подозреваемый:** *${targetInfoUser.info}* ||<@${targetInfoUser.id}>||
        \n**Нарушение УК:** *${guardYK}*\n**Розыск:** ${embedWanted}
        \n**Информация:** \`\`\`${guardInfo}\`\`\`
        \n**Подпись:** *${guardInfoUser.info}* ||<@${guardInfoUser.id}>||
        `)
        .setTimestamp()
        .setFooter({ text: `✔️ Активен`});

      const editWanted = new ButtonBuilder()
        .setCustomId('RSQ_GuardRaport_FalseWanted')
        .setLabel('Не активный')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);

      const deleteWanted = new ButtonBuilder()
        .setCustomId('RSQ_GuardRaport_DeleteWanted')
        .setLabel('Удалить')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);

      const row = new ActionRowBuilder()
        .addComponents(editWanted, deleteWanted);

      const sentMessage = await targetChannel.send({ embeds: [embedMessage], components: [row] });
    
      target.guardInfo.violations.push({
        messageId: sentMessage.id,
        messageURL: sentMessage.url,
        guardName: guardInfoUser.info,
        guardId: guardInfoUser.id,
        targetName: targetInfoUser.info,
        targetId: targetInfoUser.id,
        codex: guardYK,
        info: guardInfo,
        wanted: guardWanted
      });

      if (guardWanted === '1') {
        target.guardInfo.wanted = true;
      }

      // Сохраняем обновленные данные пользователя
      await target.save();

      await interaction.reply({ content: `Рапорт успешно отправлен --> ${sentMessage.url}`, ephemeral: true });
    } catch (error) {
      console.error('Произошла ошибка #7187:', error);
      const embedErrorMessage = new EmbedBuilder()
        .setTitle('Ошибка')
        .setColor('#FF0000')
        .setDescription('Произошла ошибка при выполнении команды (#7187)');

      await interaction.reply({ embeds: [embedErrorMessage], ephemeral: true });
    }
  }

  if (interaction.isModalSubmit() && interaction.customId === 'RSQ_infoViolationsM' ) {
    const guardName = interaction.fields.getTextInputValue('guardNameModal');
    const targetName = interaction.fields.getTextInputValue('targetNameModal');

    try {
      const guard = await UserBattalion.findOne({ name: guardName });
      if (!guard) {
        const embedNotFound = new EmbedBuilder()
          .setTitle('Ошибка')
          .setColor('#FF0000')
          .setDescription(`Дело с позывным "*${guardName}*" не найдено в базе данных`);

        await interaction.reply({ embeds: [embedNotFound], ephemeral: true });
        return;
      }

      if (!guard || guard.userId !== interaction.member.id) {
        const embedNotFound = new EmbedBuilder()
          .setTitle('Ошибка')
          .setColor('#FF0000')
          .setDescription(`У вас нет доступа к этому делу`);

        await interaction.reply({ embeds: [embedNotFound], ephemeral: true });
        return;
      }

      if (!guard.config.wantedSet) {
        const embedAccessDenied = new EmbedBuilder()
          .setTitle('Ошибка')
          .setColor('#FF0000')
          .setDescription(`У вас нет соответствующего доступа к реестру исполнительных органов`);

        await interaction.reply({ embeds: [embedAccessDenied], ephemeral: true });
        return;
      }

      const user = await UserBattalion.findOne({ name: targetName });
      if (!user) {
        const embedNotFound = new EmbedBuilder()
          .setTitle('Ошибка')
          .setColor('#FF0000')
          .setDescription(`Дело с позывным "*${targetName}*" не найдено в базе данных`);

        await interaction.reply({ embeds: [embedNotFound], ephemeral: true });
        return;
      }

      const wantedStatus = user.guardInfo.wanted ? '\`\`\`⁣                 🚨 ОБЪЯВЛЕН В РОЗЫСК 🚨                ⁣\`\`\`' : 'Не объявлен';
      const structureDescription = getInfoDBStructure(user);
      const numberClone = /^\d{4}$/.test(user.info.number) ? user.info.number : '';

      const clone = {
        id: user.userId,
        rank: `${user.info.rank}`,
        number: `${numberClone}`,
        name: `${targetName}`
      };

      const embedData = new EmbedBuilder()
        .setTitle(`Данные дела ${clone.rank} ${clone.number} ${clone.name}`)
        .setColor('#00FF00')

      if (user.guardInfo.violations.length === 0) {
        user.guardInfo.wanted ? embedData.addFields({ name: '⁣ ', value: `${wantedStatus}` }) : null,
        embedData.addFields({ name: '⁣ ', value: `**Профиль:** <@${clone.id}>\n**Структура:** *${structureDescription}*\n**Должность:** *${user.info.job}*` });
        embedData.addFields({ name: '⁣ ', value: 'Нарушений не обнаружено'});
        user.guardInfo.wanted ? embedData.addFields({ name: '⁣ ', value: `${wantedStatus}` }) : null
      } else {
        const violationsFields = user.guardInfo.violations.map((violation, index) => {
          return {
            name: `\`Нарушение #${index + 1}\``,
            value: `[Подробнее](${violation.messageURL})` +
                    `\`\`\`Статус: ${violation.status ? '✔️ Активный' : '❌ Неактивный'}\nУК: ${violation.codex}\`\`\`\n`,
            inline: true
          };
        });

        user.guardInfo.wanted ? embedData.addFields({ name: '⁣ ', value: `${wantedStatus}` }) : null,
        embedData.addFields({ name: '⁣ ', value: `**Структура:** *${structureDescription}*\n**Должность:** *${user.info.job}*` });
        embedData.addFields(...violationsFields);
        user.guardInfo.wanted ? embedData.addFields({ name: '⁣ ', value: `${wantedStatus}` }) : null
      }

      await interaction.reply({ embeds: [embedData], ephemeral: true });
    } catch (error) {
      console.error('Произошла ошибка #7187:', error);
      const embedErrorMessage = new EmbedBuilder()
        .setTitle('Ошибка')
        .setColor('#FF0000')
        .setDescription('Произошла ошибка при выполнении команды (#7187)');

      await interaction.reply({ embeds: [embedErrorMessage], ephemeral: true });
    }
  }

  if (interaction.isModalSubmit() && interaction.customId === 'RSQ_EditSquadsM' ){
    const squads = interaction.fields.getTextInputValue('RSQ_Squads');
    const guildID = interaction.guild.id;

    try {
      // Найти запись настроек по guildID или создать новую, если она отсутствует
      let settings = await SettingBattalion.findOne({ guildID });
      if (!settings) {
        settings = new SettingBattalion({ guildID });
      }

      // Обновить поле squadsBattalion
      settings.squadsBattalion = squads;

      // Сохранить обновленную запись настроек
      await settings.save();

      // Отправить подтверждение об успешном обновлении
      await interaction.reply({ content: `Данные успешно обновлены на **${squads}**`, ephemeral: true });
    } catch (error) {
      console.error('Ошибка при обновлении данных:', error);
      await interaction.reply({ content: 'Произошла ошибка при обновлении данных', ephemeral: true });
    }
  }

  if (interaction.isModalSubmit() && interaction.customId === 'RSQ_EditUserNomber' || interaction.customId === 'RSQ_EditUserRank' || interaction.customId === 'RSQ_EditUserTimeM' || interaction.customId === 'RSQ_EditUserBso' || interaction.customId === 'RSQ_EditUserSpec' || interaction.customId === 'RSQ_EditUserDateV' || interaction.customId === 'RSQ_EditUserSquad' || interaction.customId === 'RSQ_EditUserBog') {
    const nameClone = interaction.fields.getTextInputValue('nameClone');
    const settings = await SettingBattalion.findOne({ guildID: interaction.guild.id });
    const userName = await UserBattalion.findOne({ name: nameClone });

    await interaction.deferReply();

    try {
      if (!userName || userName.userId !== interaction.member.id) {
        await interaction.editReply('У вас нет прав на редактирование этого дела');
        return;
      }

      if (userName) {

        // Меняет номер
        if (interaction.customId === 'RSQ_EditUserNomber') {
          const newNomber = interaction.fields.getTextInputValue('editNomber');
          const oldNomber = userName.info.number;

          const res = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: '7th Table | Users!C4:E'
          });
      
          const rows = res.data.values;
          const rowIndex = rows.findIndex(row => row[0] === nameClone);
      
          if (rowIndex !== -1) {
            const range = `7th Table | Users!E${rowIndex + 4}`; // rowIndex + 4, потому что строка начинается с 1, а массив с 0
      
            const valueInputOption = 'USER_ENTERED';
            const valueRangeBody = {
              values: [[newNomber]]
            };
      
            await sheets.spreadsheets.values.update({
              spreadsheetId,
              range,
              valueInputOption,
              resource: valueRangeBody
            });
      
            // Обновление данных в базе данных
            const user = await UserBattalion.findOneAndUpdate({ name: nameClone }, { 'info.number': newNomber }, { new: true });

            if (user) {
              const successEmbed = new EmbedBuilder()
                .setColor('#910000')
                .setDescription('Данные успешно обновлены')
                .addFields({ name: 'Старые данные:', value: oldNomber, inline: true })
                .addFields({ name: 'Новые данные:', value: newNomber, inline: true });
            
              await interaction.editReply({ embeds: [successEmbed] });
              
              // Отправка лог сообщения
              const logEmbed = new EmbedBuilder()
                .setTitle('Изменение номера')
                .setColor('#FFA500')
                .setDescription(`Пользователь: <@${interaction.user.id}>\nПозывной: *${nameClone}*`)
                .addFields({ name: 'Старые данные:', value: oldNomber, inline: true })
                .addFields({ name: 'Новые данные:', value: newNomber, inline: true })
                .setTimestamp();
              
              // Проверяем, существует ли канал для логов
              if (settings && settings.channelID.reestrLog.updateDelo !== 'false') {
                const logChannelId = settings.channelID.reestrLog.updateDelo;
                const logChannel = interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                  await logChannel.send({ embeds: [logEmbed], ephemeral: false });
                } else {
                  console.error(`Канал с ID ${logChannelId} не найден`);
                }
              }
            } else {
              await interaction.editReply('Пользователь не найден в базе данных.');
            }
          }
        }

        // Меняет звание
        if (interaction.customId === 'RSQ_EditUserRank') {
          const editRank = interaction.fields.getTextInputValue('editRank');
          const editData = interaction.fields.getTextInputValue('editData');
          const validRanks = ['CR', 'CT', 'PVT', 'PFC', 'CS', 'CPL', 'SGT', 'SSG', 'SPSG', 'LT', 'SLT', 'SPLT', 'CPT'];
          const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/;
          const oldRank = userName.info.rank;

          if (!validRanks.includes(editRank)) {
            const embedMessageError = new EmbedBuilder()
              .setColor('#FF0000')
              .setDescription('Пожалуйста, введите корректное звание (CT, PVT, PFC, CS, CPL и т.д.)');
  
            return interaction.editReply({ embeds: [embedMessageError], ephemeral: false });
          }

          if (!dateRegex.test(editData)) {
            const errorEmbed = new EmbedBuilder()
              .setColor('#FF0000')
              .setDescription('Вы ввели некорректный формат даты. Пожалуйста, введите дату в формате ДД.ММ.ГГГГ *(пример 09.09.2023)*');
  
            return interaction.editReply({ embeds: [errorEmbed], ephemeral: false });
          }

          const res = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: '7th Table | Users!C4:U'
          });
      
          const rows = res.data.values;
          const rowIndex = rows.findIndex(row => row[0] === nameClone);
      
          if (rowIndex !== -1) {
            const range = `7th Table | Users!F${rowIndex + 4}`; // rowIndex + 4, потому что строка начинается с 1, а массив с 0
            const range2 = `7th Table | Users!M${rowIndex + 4}`; // rowIndex + 4, потому что строка начинается с 1, а массив с 0
            const range3 = `7th Table | Users!U${rowIndex + 4}`; // rowIndex + 4, потому что строка начинается с 1, а массив с 0

            const valueInputOption = 'USER_ENTERED';
            const valueRangeBody = {
              values: [[editRank]]
            };
            const valueRangeBody2 = {
              values: [[editData]]
            };
            const valueRangeBody3 = {
              values: [['0']]
            };
      
            await sheets.spreadsheets.values.update({
              spreadsheetId,
              range,
              valueInputOption,
              resource: valueRangeBody
            });
            await sheets.spreadsheets.values.update({
              spreadsheetId,
              range: range2,
              valueInputOption,
              resource: valueRangeBody2
            });
            await sheets.spreadsheets.values.update({
              spreadsheetId,
              range: range3,
              valueInputOption,
              resource: valueRangeBody3
            });
      
            // Обновление данных в базе данных
            const user = await UserBattalion.findOneAndUpdate({ name: nameClone }, { 'info.rank': editRank, 'info.dateRankUP': editData, 'battle.fightForRank': '0'  }, { new: true });

            if (user) {
              const successEmbed = new EmbedBuilder()
                .setColor('#910000')
                .setDescription('Данные успешно обновлены')
                .addFields({ name: 'Старые данные:', value: oldRank, inline: true })
                .addFields({ name: 'Новые данные:', value: editRank, inline: true });

              await interaction.editReply({ embeds: [successEmbed] });
                  
              const logEmbed = new EmbedBuilder()
                .setTitle('Изменение звания')
                .setColor('#FFA500')
                .setDescription(`Пользователь: <@${interaction.user.id}>\nПозывной: *${nameClone}*`)
                .addFields({ name: 'Старые данные:', value: oldRank, inline: true })
                .addFields({ name: 'Новые данные:', value: editRank, inline: true })
                .setTimestamp();
                  
              // Проверяем, существует ли канал для логов
              if (settings && settings.channelID.reestrLog.updateDelo !== 'false') {
                const logChannelId = settings.channelID.reestrLog.updateDelo;
                const logChannel = interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                  await logChannel.send({ embeds: [logEmbed], ephemeral: false });
                } else {
                  console.error(`Канал с ID ${logChannelId} не найден`);
                }
              }
            } else {
              await interaction.editReply('Пользователь не найден в базе данных.');
            }
          }
        }

        // Меняет время МСК
        if (interaction.customId === 'RSQ_EditUserTimeM') {
          const editTime = interaction.fields.getTextInputValue('editTime');
          const validFime = ['0', '+1', '+2', '+3', '+4', '+5', '+6', '+7', '+8', '-1', '-2', '-3', '-4', '-5', '-6', '-7', '-8'];
          const oldTime = userName.info.timeMoscow;

          if (!validFime.includes(editTime)) {
            const embedMessageError = new EmbedBuilder()
              .setColor('#FF0000')
              .setDescription('Пожалуйста, введите корректное время МСК (введите 0 если у вас время МСК, или же +1, +2, -1, -2 от МСК в зависимости от вашего времени)');
  
            return interaction.editReply({ embeds: [embedMessageError], ephemeral: false });
          }

          const oldModifiedArray = (oldTime === '0') ? 'МСК' : `МСК (${oldTime})`;
          const modifiedArray = (editTime === '0') ? 'МСК' : `МСК (${editTime})`;

          const res = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: '7th Table | Users!C4:I'
          });
      
          const rows = res.data.values;
          const rowIndex = rows.findIndex(row => row[0] === nameClone);
      
          if (rowIndex !== -1) {
            const range = `7th Table | Users!I${rowIndex + 4}`; // rowIndex + 4, потому что строка начинается с 1, а массив с 0
      
            const valueInputOption = 'USER_ENTERED';
            const valueRangeBody = {
              values: [[modifiedArray]]
            };
      
            await sheets.spreadsheets.values.update({
              spreadsheetId,
              range,
              valueInputOption,
              resource: valueRangeBody
            });
      
            // Обновление данных в базе данных
            const user = await UserBattalion.findOneAndUpdate({ name: nameClone }, { 'info.timeMoscow': editTime }, { new: true });

            if (user) {
              const successEmbed = new EmbedBuilder()
                .setColor('#910000')
                .setDescription('Данные успешно обновлены')
                .addFields({ name: 'Старые данные:', value: oldModifiedArray, inline: true })
                .addFields({ name: 'Новые данные:', value: modifiedArray, inline: true });

              await interaction.editReply({ embeds: [successEmbed] });
                
              const logEmbed = new EmbedBuilder()
                .setTitle('Изменение времени МСК')
                .setColor('#FFA500')
                .setDescription(`Пользователь: <@${interaction.user.id}>\nПозывной: *${nameClone}*`)
                .addFields({ name: 'Старые данные:', value: oldModifiedArray, inline: true })
                .addFields({ name: 'Новые данные:', value: modifiedArray, inline: true })
                .setTimestamp();
                
              // Проверяем, существует ли канал для логов
              if (settings && settings.channelID.reestrLog.updateDelo !== 'false') {
                const logChannelId = settings.channelID.reestrLog.updateDelo;
                const logChannel = interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                  await logChannel.send({ embeds: [logEmbed], ephemeral: false });
                } else {
                  console.error(`Канал с ID ${logChannelId} не найден`);
                }
              }
            } else {
              await interaction.editReply('Пользователь не найден в базе данных.');
            }
          }
        }

        // Меняет спец-ию
        if (interaction.customId === 'RSQ_EditUserSpec') {
          const editSpec = interaction.fields.getTextInputValue('editSpec');
          const validFime = ['BT', 'ABT', 'RT', 'ART', 'BM', 'BMI', 'BMS', 'BSM'];
          const oldSpec = userName.info.spec;

          if (!validFime.includes(editSpec)) {
            const embedMessageError = new EmbedBuilder()
              .setColor('#FF0000')
              .setDescription('Пожалуйста, введите корректную специализацию подразделения *(BT, ABT, RT, ART, BM, BMI, BMS, BSM)*');
  
            return interaction.editReply({ embeds: [embedMessageError], ephemeral: false });
          }

          const res = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: '7th Table | Users!C4:G'
          });
      
          const rows = res.data.values;
          const rowIndex = rows.findIndex(row => row[0] === nameClone);
      
          if (rowIndex !== -1) {
            const range = `7th Table | Users!G${rowIndex + 4}`;
      
            const valueInputOption = 'USER_ENTERED';
            const valueRangeBody = {
              values: [[editSpec]]
            };
      
            await sheets.spreadsheets.values.update({
              spreadsheetId,
              range,
              valueInputOption,
              resource: valueRangeBody
            });
      
            const user = await UserBattalion.findOneAndUpdate({ name: nameClone }, { 'info.spec': editSpec }, { new: true });

            if (user) {
              const successEmbed = new EmbedBuilder()
                .setColor('#910000')
                .setDescription('Данные успешно обновлены')
                .addFields({ name: 'Старые данные:', value: oldSpec, inline: true })
                .addFields({ name: 'Новые данные:', value: editSpec, inline: true });

              await interaction.editReply({ embeds: [successEmbed] });
                
              const logEmbed = new EmbedBuilder()
                .setTitle('Изменение спец-ии')
                .setColor('#FFA500')
                .setDescription(`Пользователь: <@${interaction.user.id}>\nПозывной: *${nameClone}*`)
                .addFields({ name: 'Старые данные:', value: oldSpec, inline: true })
                .addFields({ name: 'Новые данные:', value: editSpec, inline: true })
                .setTimestamp();
                
              // Проверяем, существует ли канал для логов
              if (settings && settings.channelID.reestrLog.updateDelo !== 'false') {
                const logChannelId = settings.channelID.reestrLog.updateDelo;
                const logChannel = interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                  await logChannel.send({ embeds: [logEmbed], ephemeral: false });
                } else {
                  console.error(`Канал с ID ${logChannelId} не найден`);
                }
              }
            } else {
              await interaction.editReply('Пользователь не найден в базе данных.');
            }
          }
        }

        // Меняет отряд
        if (interaction.customId === 'RSQ_EditUserSquad') {
          let editSquad = interaction.fields.getTextInputValue('editSquad');
          const validFime = settings.squadsBattalion.match(/\w+/g) || [];
          validFime.unshift('0');
          const oldSquad = userName.info.squad;

          if (!validFime.includes(editSquad)) {
            const embedMessageError = new EmbedBuilder()
              .setColor('#FF0000')
              .setDescription(`Пожалуйста, введите корректную аббревиатуру вашего отряда *(введите 0 если вы не состоите в отряде, или же ${settings.squadsBattalion} если относитесь к одному из этих отрядов)*`);
  
            return interaction.editReply({ embeds: [embedMessageError], ephemeral: false });
          }

          if (editSquad === '0') {
            editSquad = '➖';
          } else {
            editSquad = editSquad;
          }

          const res = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: '7th Table | Users!C4:J'
          });
      
          const rows = res.data.values;
          const rowIndex = rows.findIndex(row => row[0] === nameClone);
      
          if (rowIndex !== -1) {
            const range = `7th Table | Users!J${rowIndex + 4}`; // rowIndex + 4, потому что строка начинается с 1, а массив с 0
      
            const valueInputOption = 'USER_ENTERED';
            const valueRangeBody = {
              values: [[editSquad]]
            };
      
            await sheets.spreadsheets.values.update({
              spreadsheetId,
              range,
              valueInputOption,
              resource: valueRangeBody
            });
      
            // Обновление данных в базе данных
            const user = await UserBattalion.findOneAndUpdate({ name: nameClone }, { 'info.squad': editSquad }, { new: true });

            if (user) {
              const successEmbed = new EmbedBuilder()
                .setColor('#910000')
                .setDescription('Данные успешно обновлены')
                .addFields({ name: 'Старые данные:', value: oldSquad, inline: true})
                .addFields({ name: 'Новые данные:', value: editSquad, inline: true});

              await interaction.editReply({ embeds: [successEmbed] });
                
              const logEmbed = new EmbedBuilder()
                .setTitle('Изменение отряда')
                .setColor('#FFA500')
                .setDescription(`Пользователь: <@${interaction.user.id}>\nПозывной: *${nameClone}*`)
                .addFields({ name: 'Старые данные:', value: oldSquad, inline: true})
                .addFields({ name: 'Новые данные:', value: editSquad, inline: true})
                .setTimestamp();
                
              // Проверяем, существует ли канал для логов
              if (settings && settings.channelID.reestrLog.updateDelo !== 'false') {
                const logChannelId = settings.channelID.reestrLog.updateDelo;
                const logChannel = interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                  await logChannel.send({ embeds: [logEmbed], ephemeral: false });
                } else {
                  console.error(`Канал с ID ${logChannelId} не найден`);
                }
              }
            } else {
              await interaction.editReply('Пользователь не найден в базе данных.');
            }
          }
        }

        // Меняет должность
        if (interaction.customId === 'RSQ_EditUserBog') {

          const member = interaction.guild.members.cache.get(userName.userId);
          const roles = member.roles.cache;
          const oldBog = userName.info.job;
          
          const roleWordMap = {
            '863098749580738610': 'Командир корпуса',
            '863098617135890432': 'Зам. КМД корпуса',
            '974737363173527553': 'Гл. инструктор',
            '1128620222274879498': 'Ст. Инструктор',
            '945696911757820004': 'Инструктор',
            '939127649203273729': 'Лидер ART',
            '861612462540980224': 'Лидер RT',
            '1165595712784977970': 'Зам. лидера RT',
            '927959817992159253': 'Лидер ABT',
            '1165594972595159040': 'Зам. лидера ABT',
            '865868296992849941': 'Лидер MED',
            '1165595700168507462': 'Зам. лидера MED'
          };

          let editBog = '';
          // Проверяем, есть ли у пользователя роли из списка
          let hasRoles = false;
          roles.forEach(role => {
            if (roleWordMap[role.id]) {
              editBog += roleWordMap[role.id] + ', ';
              hasRoles = true;
            }
          });
          
          // Если у пользователя нет ни одной роли из списка, то присваиваем значение ➖
          if (!hasRoles) {
            editBog = '➖';
          } else {
            // Убираем лишнюю запятую и пробел в конце строки
            editBog = editBog.trim().slice(0, -1);
          }

          const res = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: '7th Table | Users!C4:K'
          });
      
          const rows = res.data.values;
          const rowIndex = rows.findIndex(row => row[0] === nameClone);
      
          if (rowIndex !== -1) {
            const range = `7th Table | Users!K${rowIndex + 4}`; // rowIndex + 4, потому что строка начинается с 1, а массив с 0
      
            const valueInputOption = 'USER_ENTERED';
            const valueRangeBody = {
              values: [[editBog]]
            };
      
            await sheets.spreadsheets.values.update({
              spreadsheetId,
              range,
              valueInputOption,
              resource: valueRangeBody
            });
      
            // Обновление данных в базе данных
            const user = await UserBattalion.findOneAndUpdate({ name: nameClone }, { 'info.job': editBog }, { new: true });

            if (user) {
              const successEmbed = new EmbedBuilder()
                .setColor('#910000')
                .setDescription('Данные успешно обновлены')
                .addFields({ name: 'Старые данные:', value: oldBog, inline: true })
                .addFields({ name: 'Новые данные:', value: editBog, inline: true });

              await interaction.editReply({ embeds: [successEmbed] });
                
              const logEmbed = new EmbedBuilder()
                .setTitle('Изменение должности')
                .setColor('#FFA500')
                .setDescription(`Пользователь: <@${interaction.user.id}>\nПозывной: *${nameClone}*`)
                .addFields({ name: 'Старые данные:', value: oldBog, inline: true })
                .addFields({ name: 'Новые данные:', value: editBog, inline: true })
                .setTimestamp();
                
              // Проверяем, существует ли канал для логов
              if (settings && settings.channelID.reestrLog.updateDelo !== 'false') {
                const logChannelId = settings.channelID.reestrLog.updateDelo;
                const logChannel = interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                  await logChannel.send({ embeds: [logEmbed], ephemeral: false });
                } else {
                  console.error(`Канал с ID ${logChannelId} не найден`);
                }
              }
            } else {
              await interaction.editReply('Пользователь не найден в базе данных.');
            }
          }
        }

        // Меняет членство БСО
        if (interaction.customId === 'RSQ_EditUserBso') {
          let editBso = interaction.fields.getTextInputValue('editBso');
          const validFime = ['0', 'ARC', 'ARF'];
          const oldBSO = userName.info.bso;

          if (!validFime.includes(editBso)) {
            const embedMessageError = new EmbedBuilder()
              .setColor('#FF0000')
              .setDescription('Пожалуйста, введите корректную аббревиатуру БСО *(введите 0 если вы не состоите в БСО, или же ARC; ARF если относитесь к одной из этих структур)*');
  
            return interaction.editReply({ embeds: [embedMessageError], ephemeral: false });
          }

          if (editBso === '0') {
            editBso = '➖';
          } else {
            editBso = editBso;
          }

          const res = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: '7th Table | Users!C4:H'
          });
      
          const rows = res.data.values;
          const rowIndex = rows.findIndex(row => row[0] === nameClone);
      
          if (rowIndex !== -1) {
            const range = `7th Table | Users!H${rowIndex + 4}`; // rowIndex + 4, потому что строка начинается с 1, а массив с 0
      
            const valueInputOption = 'USER_ENTERED';
            const valueRangeBody = {
              values: [[editBso]]
            };
      
            await sheets.spreadsheets.values.update({
              spreadsheetId,
              range,
              valueInputOption,
              resource: valueRangeBody
            });
      
            // Обновление данных в базе данных
            const user = await UserBattalion.findOneAndUpdate({ name: nameClone }, { 'info.bso': editBso }, { new: true });

            if (user) {
              const successEmbed = new EmbedBuilder()
                .setColor('#910000')
                .setDescription('Данные успешно обновлены')
                .addFields({ name: 'Старые данные:', value: oldBSO, inline: true })
                .addFields({ name: 'Новые данные:', value: editBso, inline: true });

              await interaction.editReply({ embeds: [successEmbed] });
                
              const logEmbed = new EmbedBuilder()
                .setTitle('Изменение БСО')
                .setColor('#FFA500')
                .setDescription(`Пользователь: <@${interaction.user.id}>\nПозывной: *${nameClone}*`)
                .addFields({ name: 'Старые данные:', value: oldBSO, inline: true })
                .addFields({ name: 'Новые данные:', value: editBso, inline: true })
                .setTimestamp();
                
              // Проверяем, существует ли канал для логов
              if (settings && settings.channelID.reestrLog.updateDelo !== 'false') {
                const logChannelId = settings.channelID.reestrLog.updateDelo;
                const logChannel = interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                  await logChannel.send({ embeds: [logEmbed], ephemeral: false });
                } else {
                  console.error(`Канал с ID ${logChannelId} не найден`);
                }
              }
            } else {
              await interaction.editReply('Пользователь не найден в базе данных.');
            }
          }
        }

        // Меняет дату вступления
        if (interaction.customId === 'RSQ_EditUserDateV') {
          const editData = interaction.fields.getTextInputValue('editData');
          const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/;
          const oldDateV = userName.info.dateV;

          if (!dateRegex.test(editData)) {
            const errorEmbed = new EmbedBuilder()
              .setColor('#FF0000')
              .setDescription('Вы ввели некорректный формат даты. Пожалуйста, введите дату в формате ДД.ММ.ГГГГ *(пример 09.09.2023)*');
  
            return interaction.editReply({ embeds: [errorEmbed], ephemeral: false });
          }

          const res = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: '7th Table | Users!C4:L'
          });
      
          const rows = res.data.values;
          const rowIndex = rows.findIndex(row => row[0] === nameClone);
      
          if (rowIndex !== -1) {
            const range2 = `7th Table | Users!L${rowIndex + 4}`;

            const valueInputOption = 'USER_ENTERED';
            const valueRangeBody2 = {
              values: [[editData]]
            };

            await sheets.spreadsheets.values.update({
              spreadsheetId,
              range: range2,
              valueInputOption,
              resource: valueRangeBody2
            });
      
            // Обновление данных в базе данных
            const user = await UserBattalion.findOneAndUpdate({ name: nameClone }, { 'info.dateV': editData }, { new: true });

            if (user) {
              const successEmbed = new EmbedBuilder()
                .setColor('#910000')
                .setDescription('Данные успешно обновлены')
                .addFields({ name: 'Старые данные:', value: oldDateV, inline: true })
                .addFields({ name: 'Новые данные:', value: editData, inline: true });

              await interaction.editReply({ embeds: [successEmbed] });
                
              const logEmbed = new EmbedBuilder()
                .setTitle('Изменение даты вступления')
                .setColor('#FFA500')
                .setDescription(`Пользователь: <@${interaction.user.id}>\nПозывной: *${nameClone}*`)
                .addFields({ name: 'Старые данные:', value: oldDateV, inline: true })
                .addFields({ name: 'Новые данные:', value: editData, inline: true })
                .setTimestamp();
                
              if (settings && settings.channelID.reestrLog.updateDelo !== 'false') {
                const logChannelId = settings.channelID.reestrLog.updateDelo;
                const logChannel = interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                  await logChannel.send({ embeds: [logEmbed], ephemeral: false });
                } else {
                  console.error(`Канал с ID ${logChannelId} не найден`);
                }
              }
            } else {
              await interaction.editReply('Пользователь не найден в базе данных.');
            }
          }
        }
      } else {
        await interaction.editReply('Ваше дело не найденно в таблице');
      }
    } catch (error) {
      console.error('Произошла ошибка #1074:', error);
      await interaction.editReply('Произошла ошибка #1074');
    }
  }
  
  if (interaction.isModalSubmit() && interaction.customId === 'raportB') {

    try{
        const nameClone = interaction.fields.getTextInputValue('nameClone');
        const nameCMDClone = interaction.fields.getTextInputValue('nameCMDClone');
        const namesGroup = interaction.fields.getTextInputValue('namesGroup');
        const date = interaction.fields.getTextInputValue('date');
        const description = interaction.fields.getTextInputValue('description');

        
          
        const existingData = await SettingBattalion.findOne({ guildID: interaction.guildId });

        let reportNumber = 1; // Устанавливаем начальный номер рапорта

        if (existingData) {
          // Если сервер найден, увеличиваем значение nFight на 1
          existingData.raports.nFight = (parseInt(existingData.raports.nFight) + 1).toString();
          await existingData.save();
          reportNumber = parseInt(existingData.raports.nFight);
        } else {
          // Создаем новую запись в SettingBattalion, если сервер не найден
          const addTodb = new SettingBattalion({
            guildID: interaction.guildId,
            guildName: interaction.guild.name
          });
          await addTodb.save();
        }

        const userCMD = await UserBattalion.findOne({ name: nameCMDClone });
        const userClone = await UserBattalion.findOne({ name: nameClone });

        if (userCMD) {
          if (userClone) {

            if (!userClone || userClone.userId !== interaction.member.id) {
              await interaction.reply('У вас нет прав на отправку рапорта от имени этого пользователя.');
              return;
            }
            const numberCMD = /^\d{4}$/.test(userCMD.info.number) ? userCMD.info.number : '';
            const numberClone = /^\d{4}$/.test(userClone.info.number) ? userClone.info.number : '';

            const commander = {
              id: userCMD.userId,
              rank: `${userCMD.info.rank}`,
              number: `${numberCMD}`,
              name: `${nameCMDClone}`
            };

            const clone = {
              id: userClone.userId,
              rank: `${userClone.info.rank}`,
              number: `${numberClone}`,
              name: `${nameClone}`
            };

            // Разделение списка имен по запятой и получение информации о каждом участнике
            const group = [];
            const namesArray = namesGroup.split(',').map(name => name.trim());
            for (const name of namesArray) {
              const user = await UserBattalion.findOne({ name });
              if (user) {
                const number = /^\d{4}$/.test(user.info.number) ? user.info.number : '';
                group.push({
                  id: user.userId,
                  rank: `${user.info.rank}`,
                  number: `${number}`,
                  name: `${name}`
                });
              }
            }

            const row = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId('RSQ_approveRaportFight')
                .setLabel('Одобрить')
                .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
                .setCustomId('RSQ_rejectRaportFight')
                .setLabel('Отклонить')
                .setStyle(ButtonStyle.Danger),
            );
              
            const channelRaportModer = client.channels.cache.get(existingData.channelID.raportsLog.fightModer);
            const channelRaportUser = client.channels.cache.get(existingData.channelID.raportsLog.fightUser);
            
            const embedToChannel = new EmbedBuilder()
              .setAuthor({ name: 'Статус: 👀', iconURL: 'https://cdn.discordapp.com/icons/981509661926785064/a_59b054b674dcdc19922b7574bc16b284.webp?size=96' })
              .setTitle(`Рапорт о боевом вылете №${reportNumber}`)
              .setColor('#3498db')
              .setDescription(`Докладывает *${clone.rank} ${clone.number} ${clone.name}* ||<@${clone.id}>|| о боевом вылете №${reportNumber}\n\n**Командир:** *${commander.rank} ${commander.number} ${commander.name} ||<@${commander.id}>||*\n**Дата и время операции:** ${date}\n\n**Состав:** ${group.map(member => `\n*${member.rank} ${member.number} ${member.name}* ||<@${member.id}>||`)}\n\n**Ход операции**\n ${description}`)
              .setTimestamp();

            const sentMessage = await channelRaportModer.send({ content: `<@&807365822154014771>`, embeds: [embedToChannel], components: [row] });
            const sentMessageUser = await channelRaportUser.send({ embeds: [embedToChannel] });
            await interaction.reply({ content: `Рапорт успешно отправлен! Вашему рапорту присвоен **${reportNumber}** номер, после рассмотрения рапорта вашим командованием, вы узнаете его статус в этом канале --> ${sentMessageUser.url}`, ephemeral: false });

            for (const member of group) {
              if (member.number === '') {
                member.number = '➖';
              }
            }
            
            const commanderNumber = commander.number !== '' ? commander.number : '➖';
            const cloneNumber = clone.number !== '' ? clone.number : '➖';

            const newReport = new RaportFight({
              reportNumber,
              moderatorMessageId: sentMessage.id,
              moderatorChannelId: existingData.channelID.raportsLog.fightModer,
              userMessageId: sentMessageUser.id,
              userChannelId: existingData.channelID.raportsLog.fightUser,
              reporter: {
                id: clone.id,
                rank: clone.rank,
                number: cloneNumber,
                name: clone.name
              },
              commander: {
                id: commander.id,
                rank: commander.rank,
                number: commanderNumber,
                name: commander.name
              },
              group,
              operationDescription: description,
              date
            });

            await newReport.save();

          } else {
            await interaction.reply('Тот кто докладывает не найден в базе данных');
          }
        } else {
          await interaction.reply('Командир не найден в базе данных');
        }
    } catch (error) {
      console.error(`Произошла ошибка (#4544): ${error}`);   
    }
  }

  if (interaction.isModalSubmit() && interaction.customId === 'newnamereestr') {

    try {
      await interaction.deferReply();

      // Добавляем пользователя в очередь
      queue.push(interaction);

      // Вычисляем позицию пользователя в очереди
      const position = queue.length;
      
      //console.log(`Пользователь ${interaction.user.username} занял позицию в очереди: ${position}`);

      if (position === 1) {
        const firstInQueueMessage = new EmbedBuilder()
          .setTitle('Обработка запроса')
          .setColor('#00FF00')
          .setDescription('Вы первый в очереди, обрабатываем ваш запрос...');

        await interaction.followUp({ embeds: [firstInQueueMessage] });
      } else {
        // Отправляем сообщение пользователю о его позиции в очереди
        const queueMessage = new EmbedBuilder()
          .setTitle('Обработка запроса')
          .setColor('#FFFF00')
          .setDescription(`Ваш запрос на добавление данных обрабатывается. Позиция в очереди: ${position}`);
        
        await interaction.editReply({ embeds: [queueMessage], ephemeral: true });
      }
        
      // Если очередь не обрабатывается в данный момент, начинаем обработку
      if (!isProcessingQueue) {
        await processQueue();
      }
    } catch (error) {
      console.error(error);
  
      const embedErrorMessage = new EmbedBuilder()
        .setTitle('Ошибка')
        .setColor('#FF0000')
        .setDescription('Произошла ошибка при выполнении команды');
  
      interaction.editReply({ embeds: [embedErrorMessage], ephemeral: false });
    }
  }
};

async function createEmbedMessage(selectedValue, settings) {
  let actualRadio;
  const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });

  // Проверяем, есть ли значение в базе данных
  if (selectedValue in settings.radioConnection.numberRadio) {
    actualRadio = settings.radioConnection.numberRadio[selectedValue];
  } else {
    actualRadio = 'Нет данных';
  }
  
  return new EmbedBuilder()
    .setTitle('Штаб корпуса')
    .setColor('#910000')
    .addFields({ name: `⁣ `, value: `📡 **Частоты корпуса**\n╎⁣ \n╎⁣ *${actualRadio}* | **Основная**\n╎⁣ *ZULU - 91.1* | **Смежная**\n╰` })
    .setFooter({ text: `Обновлено: ${timestamp}` });
}
