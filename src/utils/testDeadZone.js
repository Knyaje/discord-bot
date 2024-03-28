const { DiscordAPIError, ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { RSQ, DeadZone } = require("../../config.json");
const DZ_question = require("../../questions.json");
const Answer = require("../models/Answer");
const { channelTimers, deleteChannelAndCancelTimer } = require("./activeArrays");

async function startQuestForUser(client, interaction) {
    const guild = interaction.guild;

    try {
        const category = await guild.channels.fetch(DeadZone.config.quest.categoryCreateChannel);
        const member = interaction.member;
        const userLogin = interaction.user.username.toLowerCase();
        const cleanUserLogin = userLogin.replace(/[^a-zA-Z0-9-_]/g, '');
        const channelName = `тест-${cleanUserLogin}`;
        const modalName = interaction.fields.getTextInputValue('DZ_PersName');
        const modalPoznivnoy = interaction.fields.getTextInputValue('DZ_PersPozivnoy');
        const modalnumber = interaction.fields.getTextInputValue('DZ_PersNumber');

        // Поиск существующего канала
        const existingChannel = guild.channels.cache.find(channel =>
            channel.type === ChannelType.GuildText &&
            channel.parent === category &&
            channel.name === channelName
        );

        // Если канал уже существует, отправляем сообщение об ошибке
        if (existingChannel) {
            await existingChannel.send({ content: `У вас уже есть активный текстовый канал ${member}`, ephemeral: false });
            await interaction.reply({ content: `У вас уже есть активный текстовый канал ${existingChannel}`, ephemeral: true });
            return;
        }

        const textChannel = await guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: category,
            permissionOverwrites: [
                {
                    id: guild.id, // @everyone
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                    deny: [PermissionsBitField.Flags.SendMessages],
                },
            ],
        });

        await interaction.reply({ content: `Для вас был создан текстовый канал для прохождения теста --> ${textChannel}`, ephemeral: true });

        // Отправка приветственного сообщения
        const welcomeMessage = new EmbedBuilder()
            .setTitle('Вступительное сообщение')
            .setDescription('Кто убивал детей..? <@253529816823758850> убивал детей...')
            .setColor('#0099ff')
            .setTimestamp();

        await textChannel.send({ content: `${interaction.user}`, embeds: [welcomeMessage] });

        const channelId = textChannel.id;
        channelTimers[textChannel.id] = setTimeout(() => {
            deleteChannelAndCancelTimer(client, channelId);
        }, RSQ.config.timeToDeleteChannel);

        await new Promise(resolve => setTimeout(resolve, 15000));

        textChannel.permissionOverwrites.edit(member, { SendMessages: true });
        const questions = DZ_question.sort(() => Math.random() - 0.5); // Рандомизировать список вопросов
        const answers = {};

        for (let i = 0; i < 10; i++) {
            const question = questions[i].question;
            const questionEmbed = new EmbedBuilder()
                .setTitle(`Вопрос ${i + 1}`)
                .setDescription(question);
        
            await textChannel.send({ embeds: [questionEmbed] });
        
            const filter = m => m.author.id === interaction.user.id;
            try {
                const collected = await textChannel.awaitMessages({ filter, max: 1 });
                const answer = collected.first().content;
                answers[question] = answer;
            } catch (error) {
                if (error instanceof DiscordAPIError && error.code === 10003) {
                    //console.log("Ваш канал был удален");
                    return;
                } else {
                    //console.error("Произошла ошибка при ожидании ответа:", error);
                    return;
                }
            }
        }

        await textChannel.permissionOverwrites.edit(member, { SendMessages: false });

        /*const userChannel = guild.channels.cache.get(DeadZone.config.quest.channelInside);
        const avatar = interaction.user.displayAvatarURL({ format: 'png', size: 4096 });
        
        const embedAnswers = new EmbedBuilder()
            .setTitle('Ответы на вопросы')
            .setColor('#3498db')
            .setAuthor({ name: 'Статус: 👀', iconURL: avatar })
            .setDescription(`123`);

        const userMessage = await userChannel.send({ embeds: [embedAnswers] });*/

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('DZ_approveTest')
                .setLabel('Одобрить')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('DZ_rejectTest')
                .setLabel('Отклонить')
                .setStyle(ButtonStyle.Danger),
        );

        const avatar = interaction.user.displayAvatarURL({ format: 'png' });

        // Отправка Embed сообщения в закрытый текстовый канал для модераторов
        const moderatorChannelId = DeadZone.config.quest.channelAppryary;
        const moderatorChannel = guild.channels.cache.get(moderatorChannelId);
        const embedAnswersModerator = new EmbedBuilder()
            .setAuthor({ name: 'Статус: 👀', iconURL: avatar })
            .setDescription(`Подал ${interaction.user}\n\nИмя и Фамилия: *${modalName}*\n Позывной: *${modalPoznivnoy}*\nВозраст: *${modalnumber}*\n\n\n${Object.entries(answers).map(([question, answer]) => `**Вопрос:** ${question}\n**Ответ:** ${answer}`).join('\n\n')}`)
            .setColor('#3498db')
            .setTimestamp();

        const moderatorMessage = await moderatorChannel.send({ embeds: [embedAnswersModerator], components: [row] });

        const newAnswer = new Answer({
            userId: interaction.user.id,
            userAvatar: avatar,
            moderatorMessageId: moderatorMessage.id,
            answers: answers,
            moderatorChannelId: moderatorChannelId,
            personalInfo: {
                name: modalName,
                pozivnoy: modalPoznivnoy,
                years: modalnumber
            },
        });
        await newAnswer.save();

        const sucessEmbed = new EmbedBuilder()
            .setTitle('Успешно')
            .setDescription(`Ваши ответы отправлены на рассмотрение, статус вашего теста вы можете отслеживать здесь --> `)
            .setColor('#0099ff');

        await textChannel.send({ embeds: [sucessEmbed] });

        setTimeout(async () => {
            try {
                await textChannel.delete();
            } catch (error) {
                console.error(`Произошла ошибка при выполнении (#6820):`, error);
            }
        }, 20000);
    } catch (error) {
        console.error(`Произошла ошибка (#2520):`, error);
        const channel = interaction.channel;

        const embedErrorMessage = new EmbedBuilder()
            .setTitle('Ошибка')
            .setColor('#FF0000')
            .setDescription('Произошла ошибка при выполнении (#2520)');

        await interaction.reply({ embeds: [embedErrorMessage], ephemeral: true });
    }
}

module.exports = {
    startQuestForUser
};