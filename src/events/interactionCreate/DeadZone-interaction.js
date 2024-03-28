const { ActionRowBuilder, PermissionsBitField, ChannelType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { startQuestForUser } = require("../../utils/testDeadZone");
const DZ_Answer = require("../../models/Answer");
const DZ_Report = require("../../models/DZ-Report");
const Setting = require("../../models/GuildSettings");
const { DeadZone } = require("../../../config.json");

module.exports = async (client, interaction) => {

    if (interaction.isModalSubmit() && interaction.customId === 'DZ_Personaly_Info') {

        await startQuestForUser(client, interaction);
    }

    if (interaction.isModalSubmit() && interaction.customId === 'DZ_ComplaintM') {
        
        try {
            const name = interaction.fields.getTextInputValue('DZ_ComplaintName');
            const date = interaction.fields.getTextInputValue('DZ_ComplaintDate');
            const info = interaction.fields.getTextInputValue('DZ_ComplaintInfo');
            const guildId = interaction.guild.id;
            const member = interaction.member;
            const setting = await Setting.findOne({ guildId });

            if (!setting || setting.raports.categoryRaport === 'false') {
                await interaction.reply({ content: 'Категория для отчетов не установлена.', ephemeral: true });
                return;
            }

            const category = interaction.guild.channels.cache.get(setting.raports.categoryRaport);

            if (!category) {
                await interaction.reply({ content: 'Указанная категория не существует.', ephemeral: true });
                return;
            }

            if (!setting || setting.raports.channelMod === 'false') {
                await interaction.reply({ content: 'Текстовый канал для модерации не назначен', ephemeral: true });
                return;
            }

            const channelMod = interaction.guild.channels.cache.get(setting.raports.channelMod);

            if (!channelMod) {
                await interaction.reply({ content: 'Указанные текстовый канал не существует', ephemeral: true });
                return;
            }

            const userLogin = interaction.user.username.toLowerCase();
            const cleanUserLogin = userLogin.replace(/[^a-zA-Z0-9-_]/g, '');
            const channelName = `user-${cleanUserLogin}`;
            const role = ['1207728846149787648', '1207728954623000636'];

            const textChannel = await interaction.guild.channels.create({
                name: channelName,
                type: ChannelType.GuildText,
                parent: category,
                permissionOverwrites: [
                    {
                        id: guildId, // @everyone
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: role,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                        deny: [PermissionsBitField.Flags.SendMessages],
                    },
                ],
            });

            const embedUser = new EmbedBuilder()
                .setDescription(`**Данные нарушителя:** ${name}\n**Дата/время нарушения:** ${date}\n\n**Информация:**\n\`\`\`${info}\`\`\`\n**Не забудьте предоставить док-во в этом текстовом канале!**`);

            await textChannel.send({ content: `${member}`, embeds: [embedUser], ephemeral: false });
            
            const embedModer = new EmbedBuilder()
                .setDescription(`**Данные нарушителя:** ${name}\n**Дата/время нарушения:** ${date}\n\n**Информация:**\n\`\`\`${info}\`\`\``);

            const editWanted = new ButtonBuilder()
                .setCustomId('DZ_answerReport')
                .setLabel('Ответить')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(false);
        
            const deleteWanted = new ButtonBuilder()
                .setCustomId('DZ_deleteReport')
                .setLabel('Закрыть')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(false);

            const row = new ActionRowBuilder()
                .addComponents(editWanted, deleteWanted);

            const sentMessageMod = await channelMod.send({ content: `${role}`, embeds: [embedModer], components: [row], ephemeral: false });
            await interaction.reply({ content: `Для вас был создан текстовый канал --> ${textChannel}`, ephemeral: true });
        
            await DZ_Report.create({
                userId: interaction.user.id,
                channelID: textChannel.id,
                moderatorMessageId: sentMessageMod.id,
                info: {
                    complaintName: name,
                    complaintDate: date,
                    ComplaintInfo: info
                }
            });
        } catch(error) {
            console.log('Произошла ошибка #2351', error)

            const embedErrorMessage = new EmbedBuilder()
                .setTitle('Ошибка')
                .setColor('#FF0000')
                .setDescription('Произошла ошибка при выполнении команды (#2351)');
    
            await interaction.reply({ embeds: [embedErrorMessage], ephemeral: true });
        }
    }

    if (interaction.isButton() && interaction.customId === 'DZ_answerReport') {
    
        const modal = new ModalBuilder()
          .setCustomId('DZ_AnswerM')
          .setTitle('Сообщение для пользователя');
    
        const name = new TextInputBuilder()
          .setCustomId('DZ_Answer')
          .setLabel("Ответ")
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Тут должен быть ответ (без матов (желательно))');
    
        modal.addComponents(
          new ActionRowBuilder().addComponents(name)
        );
    
        // Отображение модального окна
        await interaction.showModal(modal);
    }

    if (interaction.isButton() && interaction.customId === 'DZ_deleteReport') {
    
        const modal = new ModalBuilder()
          .setCustomId('DZ_AnswerM2')
          .setTitle('Сообщение для пользователя');
    
        const name = new TextInputBuilder()
          .setCustomId('DZ_Answer')
          .setLabel("Решение")
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('0 - в жалобе отказано | 1 - жалоба принята');
        
        const alo = new TextInputBuilder()
          .setCustomId('DZ_Answer2')
          .setLabel("Вердикт")
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('');
    
        modal.addComponents(
          new ActionRowBuilder().addComponents(name),
          new ActionRowBuilder().addComponents(alo)
        );
    
        // Отображение модального окна
        await interaction.showModal(modal);
    }

    if (interaction.isModalSubmit() && interaction.customId === 'DZ_AnswerM2') {
        const answer = interaction.fields.getTextInputValue('DZ_Answer');
        const answer2 = interaction.fields.getTextInputValue('DZ_Answer2');
        const messageId = interaction.message.id;

        try {
            // Поиск записи по messageId в базе данных
            const report = await DZ_Report.findOne({ moderatorMessageId: messageId }).exec();
    
            // Если запись найдена, отправляем ответ в указанный канал
            if (report) {
                const channel = await client.channels.fetch(report.channelID);
                
                const embedUser = new EmbedBuilder()
                    .setDescription(``);

                const messageAnswer = await channel.send({ embeds: [embed] });
                await interaction.reply({ content: `Сообщение успешно отправлено --> ${messageAnswer.url}`, ephemeral: true })
            } else {
                console.error('Ошибка: сообщение жалобы не найдено в базе данных.');
            }
        } catch (error) {
            console.error('Ошибка при обработке взаимодействия:', error);
        }
    }

    if (interaction.isModalSubmit() && interaction.customId === 'DZ_AnswerM') {
        const answer = interaction.fields.getTextInputValue('DZ_Answer');
        const messageId = interaction.message.id;

        try {
            // Поиск записи по messageId в базе данных
            const report = await DZ_Report.findOne({ moderatorMessageId: messageId }).exec();
    
            // Если запись найдена, отправляем ответ в указанный канал
            if (report) {
                const channel = await client.channels.fetch(report.channelID);
                const messageAnswer = await channel.send(`\`\`\`${answer}\`\`\``);
                await interaction.reply({ content: `Сообщение успешно отправлено --> ${messageAnswer.url}`, ephemeral: true })
            } else {
                console.error('Ошибка: сообщение жалобы не найдено в базе данных.');
            }
        } catch (error) {
            console.error('Ошибка при обработке взаимодействия:', error);
        }
    }

    if (interaction.isButton() && interaction.customId === 'DZ_StartQuest') {

        const existingAnswer = await DZ_Answer.findOne({ userId: interaction.user.id });
        if (existingAnswer) {
            const embedAnswers = new EmbedBuilder()
            .setTitle('Ошибка')
            .setColor('#FF0000')
            .setDescription(`Вы уже проходили тест, и он все еще находится на рассмотрении`);

            await interaction.reply({ embeds: [embedAnswers], ephemeral: true });
            return;
        }

        const member = interaction.guild.members.cache.get(interaction.user.id);
        if (member.roles.cache.has('1207728282213163048')) {
            const embedAccessDenied = new EmbedBuilder()
                .setTitle('Ошибка')
                .setColor('#FF0000')
                .setDescription(`Вы уже имеете доступ к серверу, вам не нужно проходить тест`);

            await interaction.reply({ embeds: [embedAccessDenied], ephemeral: true });
            return;
        }

        const modal = new ModalBuilder()
          .setCustomId('DZ_Personaly_Info')
          .setTitle('Основная информация');
    
        const name = new TextInputBuilder()
          .setCustomId('DZ_PersName')
          .setLabel("Имя и фамилия персонажа (на латтинице)")
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Напишите имя и фамилию вашего будущего персонажа');

        const pozivnoy = new TextInputBuilder()
          .setCustomId('DZ_PersPozivnoy')
          .setLabel("Позывной (на русском)")
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Напишите позывной вашего будущего персонажа');

        const number = new TextInputBuilder()
          .setCustomId('DZ_PersNumber')
          .setLabel("Ваш реальный возраст (не персонажа)")
          .setStyle(TextInputStyle.Short)
          .setMaxLength(2)
          .setPlaceholder('Напишите ваш возраст');
    
        modal.addComponents(
          new ActionRowBuilder().addComponents(name),
          new ActionRowBuilder().addComponents(pozivnoy),
          new ActionRowBuilder().addComponents(number)
        );
    
        // Отображение модального окна
        await interaction.showModal(modal);
    }

    if (interaction.isButton() && interaction.customId === 'DZ_ReportPlayer') {

        const modal = new ModalBuilder()
          .setCustomId('DZ_ComplaintM')
          .setTitle('Жалоба на игрока');
    
        const name = new TextInputBuilder()
          .setCustomId('DZ_ComplaintName')
          .setLabel("Данные нарушителя")
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Напишите [дискорд/позывной/имя/не знаю] нарушителя, любую информацию о нарушителе которая поможет его опознать');

        const pozivnoy = new TextInputBuilder()
          .setCustomId('DZ_ComplaintDate')
          .setLabel("Время")
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Напишите примерное [время/дату] произошедшего нарушения');

        const number = new TextInputBuilder()
          .setCustomId('DZ_ComplaintInfo')
          .setLabel("Опишите ситуацию")
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Распишите суть вашей жалобы, что было нарушено? Как до этого дошло и на что повлияло?');
    
        modal.addComponents(
          new ActionRowBuilder().addComponents(name),
          new ActionRowBuilder().addComponents(pozivnoy),
          new ActionRowBuilder().addComponents(number)
        );
    
        // Отображение модального окна
        await interaction.showModal(modal);
    }

    if (interaction.isButton() && interaction.customId === 'DZ_PartnerSet') {

        const modal = new ModalBuilder()
          .setCustomId('DZ_PartnerM')
          .setTitle('Подать заявку на партнерство');
    
        const name = new TextInputBuilder()
          .setCustomId('DZ_ComplaintName')
          .setLabel("Ссылка на ваш канал")
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Предоставьте ссылку на ваш медиаресурс (YouTube/Twich)');

        const pozivnoy = new TextInputBuilder()
          .setCustomId('DZ_ComplaintDate')
          .setLabel("Ваш контент")
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Опишите тематику вашего медиаресурса');

        const number = new TextInputBuilder()
          .setCustomId('DZ_ComplaintInfo')
          .setLabel("Как вы о нас узнали?")
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Как вы узнали о проекте?');
    
        modal.addComponents(
          new ActionRowBuilder().addComponents(name),
          new ActionRowBuilder().addComponents(pozivnoy),
          new ActionRowBuilder().addComponents(number)
        );
    
        // Отображение модального окна
        await interaction.showModal(modal);
    }

    if (interaction.isModalSubmit() && interaction.customId === 'DZ_PartnerM') {
        const answer = interaction.fields.getTextInputValue('DZ_ComplaintName');
        const answer2 = interaction.fields.getTextInputValue('DZ_ComplaintDate');
        const answer3 = interaction.fields.getTextInputValue('DZ_ComplaintInfo');

        try {

            const textChannelId = '1218671832400658572';
            const textChannel = await client.channels.fetch(textChannelId);
            const avatar = interaction.user.displayAvatarURL({ format: 'png' });

            if (textChannel) {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: `${interaction.user.tag}`, iconURL: avatar })
                    .setDescription(`**Пользователь:** <@${interaction.user.id}>\n**Тематика:** ${answer2}\n[Медиаресурс](${answer})\n\n**Узнал:**\n*${answer3}*`)
                    .setColor('#d9ed53');
    
                // Отправляем Embed сообщение в текстовый канал
                await textChannel.send({ embeds: [embed] });
                await interaction.reply({ content: 'Заявка успешно отправлена! Ожидайте, в ближайшее время с вами свяжется представитель администрации.', ephemeral: true });
            } else {
                console.error('Текстовый канал не найден или не является текстовым');
            }

        } catch (error) {
            console.error('Ошибка при обработке взаимодействия:', error);
        }
    }

    if (interaction.isButton() && interaction.customId === 'DZ_rejectTest') {

        const modal = new ModalBuilder()
          .setCustomId('DZ_Test_injury')
          .setTitle('Причина отказа');
    
        const DZ = new TextInputBuilder()
          .setCustomId('DZ_TestNumber')
          .setLabel("Причина отказа")
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Распишите/напишите причину вашего отказа');
    
        modal.addComponents(
          new ActionRowBuilder().addComponents(DZ)
        );
    
        // Отображение модального окна
        await interaction.showModal(modal);
    }
    
    if (interaction.isButton() && interaction.customId === 'DZ_approveTest' || interaction.isModalSubmit() && interaction.customId === 'DZ_Test_injury') {
        try {
            // Получение данных из базы данных по ID сообщения модератора
            const answer = await DZ_Answer.findOne({ moderatorMessageId: interaction.message.id });
            
            let reason;
            if (interaction.isModalSubmit() && interaction.customId === 'DZ_Test_injury') {
                reason = interaction.fields.getTextInputValue('DZ_TestNumber');
            }
    
            if (!answer) {
                return await interaction.reply({ content: 'Данные не найдены.', ephemeral: true });
            }
    
            // Получение канала и сообщения пользователя
            const guild = interaction.guild;
            const userChannel = guild.channels.cache.get(DeadZone.config.quest.channelInside);
            /*const userChannel = guild.channels.cache.get(answer.userChannelId);
            if (!userChannel) {
                return await interaction.reply({ content: 'Канал пользователя не найден.', ephemeral: true });
            }
    
            const userMessage = await userChannel.messages.fetch(answer.userMessageId);
            if (!userMessage) {
                return await interaction.reply({ content: 'Сообщение пользователя не найдено.', ephemeral: true });
            }*/
    
            // Получение канала и сообщения модератора
            const moderatorChannel = guild.channels.cache.get(answer.moderatorChannelId);
            if (!moderatorChannel) {
                return await interaction.reply({ content: 'Канал модератора не найден.', ephemeral: true });
            }
    
            const moderatorMessage = await moderatorChannel.messages.fetch(answer.moderatorMessageId);
            if (!moderatorMessage) {
                return await interaction.reply({ content: 'Сообщение модератора не найдено.', ephemeral: true });
            }

            const avatar = answer.userAvatar;
            const embedAnswersUser = new EmbedBuilder()
                //.setTitle('Ответы пользователя')
                .setAuthor(interaction.customId === 'DZ_approveTest' ? { name: 'Статус: ✔️', iconURL: avatar } : { name: 'Статус: ❌', iconURL: avatar })
                .setDescription(interaction.customId === 'DZ_approveTest' ? `Ваша заявка была рассмотрена и принята, вам был выдан доступ на сервер!` : `<@${answer.userId}>\n\nВаша заявка была рассмотрена и не прошла проверку!\n\nПричина: ${reason}\n\nЕсли у вас возникли вопросы, задайте их в соответствующих каналах.`)
                .setColor(interaction.customId === 'DZ_approveTest' ? '#00FF00' : '#FF0000')
                .setTimestamp();
    
            await userChannel.send({ content: `<@${answer.userId}>`, embeds: [embedAnswersUser] });
    
            const embedAnswersModerator = new EmbedBuilder()
                .setAuthor(interaction.customId === 'DZ_approveTest' ? { name: 'Статус: ✔️', iconURL: avatar } : { name: 'Статус: ❌', iconURL: avatar })
                .setDescription(interaction.customId === 'DZ_approveTest' ? `Подал <@${answer.userId}>\n\n\nПроверил: ${interaction.user}\n\n\n${Object.entries(answer.answers).map(([question, answer]) => `**Вопрос:** ${question}\n**Ответ:** ${answer}`).join('\n\n')}` : `Подал <@${answer.userId}>\n\n\nПроверил: ${interaction.user}\nПричина отказа: ${reason}\n\n\n${Object.entries(answer.answers).map(([question, answer]) => `**Вопрос:** ${question}\n**Ответ:** ${answer}`).join('\n\n')}`)
                .setColor(interaction.customId === 'DZ_approveTest' ? '#00FF00' : '#FF0000')
                .setTimestamp();

            await moderatorMessage.edit({ embeds: [embedAnswersModerator], components: [] });

            if (interaction.customId === 'DZ_approveTest') {
                const user = await guild.members.fetch(answer.userId);
                if (user) {
                    // Если пользователь найден, добавляем ему роль
                    const roleToAdd = '1207728282213163048'; // Замените ID_вашей_роли на реальный ID роли
                    await user.roles.add(roleToAdd);
                } else {
                    console.log('Пользователь не найден');
                }
            }

            await interaction.deferUpdate();
        
            // Удаление данных из базы данных
            await DZ_Answer.deleteOne({ _id: answer._id });
    
        } catch (error) {
            console.error('Ошибка при обработке кнопки:', error);
            await interaction.reply({ content: 'Произошла ошибка при обработке кнопки.', ephemeral: true });
        }
    }
}