const { PermissionFlagsBits, ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js'); // Ебаные ивенты...
const { RSQ, DeadZone } = require('../../../config.json');

module.exports = {
    name: "menu",
    description: "Интерактивное меню",
    deleted: false,
    devOnly: false,
    testOnly: false,
    levelsystem: false,
    rsq_battalions: false,
    options: [
        {
            name: 'меню',
            description: 'Выберите тип меню',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Базовое меню',
                    value: 'baseMenu'
                },
                {
                    name: 'Меню командования / Партнерка',
                    value: 'commandMenu'
                },
                {
                    name: 'Жалобы',
                    value: 'reportMenu'
                }
            ]
        },
        {
            name: 'канал',
            description: 'Выберите канал для отправки меню',
            type: ApplicationCommandOptionType.Channel,
            required: true
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],

    callback: async (client, interaction) => {

        try {
            const menuType = interaction.options.getString('меню');
            const targetChannel = interaction.options.getChannel('канал');

            switch (menuType) {
                case 'baseMenu':
                    if (interaction.guildId === RSQ.menuOptions['91-battalion'].BattalionGuildID) {
                        await sendMenu91(interaction, targetChannel);
                    } else if (interaction.guildId === RSQ.menuOptions['7-battalion'].BattalionGuildID) {
                        await sendMenu7(interaction, targetChannel);
                    } else if (interaction.guildId === DeadZone.DiscordGuildID) {
                        await sendMenuDeadZone(interaction, targetChannel);
                    } else {
                        const embedErrorMessage = new EmbedBuilder()
                            .setTitle('Ошибка')
                            .setColor('#FF0000')
                            .setDescription('Совпадений не найдено');
                        await interaction.reply({ embeds: [embedErrorMessage], ephemeral: true });
                    }
                break;
                case 'commandMenu':
                    if (interaction.guildId === RSQ.menuOptions['91-battalion'].BattalionGuildID) {
                        await sendMenuCommand91(interaction, targetChannel);
                    } else if (interaction.guildId === RSQ.menuOptions['7-battalion'].BattalionGuildID) {
                        await sendMenuCommand7(interaction, targetChannel);
                    } else if (interaction.guildId === DeadZone.DiscordGuildID) {
                        await sendPartnerDeadZone(interaction, targetChannel);
                    } else {
                        const embedErrorMessage = new EmbedBuilder()
                            .setTitle('Ошибка')
                            .setColor('#FF0000')
                            .setDescription('Совпадений не найдено');
                        await interaction.reply({ embeds: [embedErrorMessage], ephemeral: true });
                    }
                break;
                case 'reportMenu':
                    if (interaction.guildId === DeadZone.DiscordGuildID) {
                        await sendReportDeadZone(interaction, targetChannel);
                    }
                break;
            }
        } catch (error) {
            console.error(`Произошла ошибка (#8574): ${error}`);

            const embedErrorMessage = new EmbedBuilder()
                .setTitle('Ошибка')
                .setColor('#FF0000')
                .setDescription('Произошла ошибка при выполнении команды (#8574)');

            await interaction.reply({ embeds: [embedErrorMessage], ephemeral: true });
        }
    }
};

async function sendMenuCommand91(interaction, targetChannel) {

    const embed = new EmbedBuilder()
        .setAuthor({ name: '91-й Разведывательный корпус' })
        .setColor('#FFFFFF')
        .setDescription(`Командное меню`);
        //.setImage('https://media.tenor.com/kZU6mL-vYagAAAAC/91st-mrc.gif');

    const prikaz = new ButtonBuilder()
        .setCustomId('RSQ_EditPrikaz')
        .setLabel('Приказы')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);

    const radio = new ButtonBuilder()
        .setCustomId('RSQ_EditRadio')
        .setLabel('Частоты')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);

    const squad = new ButtonBuilder()
        .setCustomId('RSQ_EditSquads')
        .setLabel('Отряды')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);

    const balls = new ButtonBuilder()
        .setCustomId('RSQ_EditBalls')
        .setLabel('Баллы')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);

    const kick = new ButtonBuilder()
        .setCustomId('RSQ_DeleteUser')
        .setLabel('Исключить')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);

    const row = new ActionRowBuilder()
        .addComponents(prikaz, radio, squad, balls, kick);

    await targetChannel.send({ embeds: [embed], components: [row], ephemeral: false });
    await interaction.reply({ content: 'Сообщение отправлено', ephemeral: true });
}

async function sendMenuCommand7(interaction, targetChannel) {

    const embed = new EmbedBuilder()
        .setAuthor({ name: '7-й Батальон гвардии' })
        .setColor('#FFFFFF')
        .setDescription(`Командное меню`);
        //.setImage('https://media.tenor.com/kZU6mL-vYagAAAAC/91st-mrc.gif');

    const prikaz = new ButtonBuilder()
        .setCustomId('RSQ_EditPrikaz')
        .setLabel('Приказы')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);

    const radio = new ButtonBuilder()
        .setCustomId('RSQ_EditRadio')
        .setLabel('Частоты')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);

    const squad = new ButtonBuilder()
        .setCustomId('RSQ_EditSquads')
        .setLabel('Отряды')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);

    const balls = new ButtonBuilder()
        .setCustomId('RSQ_Wanted')
        .setLabel('Рапорт о нарушении')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);

    const test2 = new ButtonBuilder()
        .setCustomId('RSQ_infoViolations')
        .setLabel('Пробить')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);

    const kick = new ButtonBuilder()
        .setCustomId('RSQ_DeleteUser')
        .setLabel('Исключить')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);

    const row1 = new ActionRowBuilder()
        .addComponents(prikaz, radio, squad);
    
    const row2 = new ActionRowBuilder()
        .addComponents(balls, test2, kick);

    await targetChannel.send({ embeds: [embed], components: [row1, row2], ephemeral: false });
    await interaction.reply({ content: 'Сообщение отправлено', ephemeral: true });
}

async function sendMenu91(interaction, targetChannel) {

    const animatedEmoji = '<a:heart_green91:1177312765631795300>';
    const animatedEmoji4 = '<a:heart_white91:1177312762347671592>';

    const embed = new EmbedBuilder()
        .setTitle('91-й Разведывательный корпус')
        .setColor('#FFFFFF')
        .setDescription(`${animatedEmoji} **Учет корпуса** - для занесения или обновления данных в таблицу корпуса\n\n${animatedEmoji4} **Таблица корпуса** - база данных 91-го включающая все личные дела клонов и джедаев которые находятся или приписаны к 91-у МРК`)
        .setImage('https://media.tenor.com/kZU6mL-vYagAAAAC/91st-mrc.gif');

    const confirm = new ButtonBuilder()
        .setCustomId('RSQ_BattalionMenu')
        .setLabel('Учет корпуса')
        .setStyle(ButtonStyle.Success)
        .setDisabled(false);

    const deleteButton = new ButtonBuilder()
        .setLabel('Таблица корпуса')
        .setStyle(ButtonStyle.Link)
        .setURL('https://docs.google.com/spreadsheets/d/1VS6CdezSMIKEPOy-fe-tk9Qv2X_qAQV6esGHxY6324M/edit#gid=1133204883')
        .setDisabled(false);

    const row = new ActionRowBuilder()
        .addComponents(confirm, deleteButton);

    await targetChannel.send({ embeds: [embed], components: [row], ephemeral: false });
    await interaction.reply({ content: 'Сообщение отправлено', ephemeral: true });
}

async function sendMenu7(interaction, targetChannel) {

    const embed = new EmbedBuilder()
        .setTitle('7-й Батальон гвардии')
        .setColor('#FFFFFF')
        .setDescription(`Текст`);

    const confirm = new ButtonBuilder()
        .setCustomId('RSQ_BattalionMenu')
        .setLabel('Учет батальона')
        .setStyle(ButtonStyle.Success)
        .setDisabled(false);

    const deleteButton = new ButtonBuilder()
        .setLabel('Таблица батальона')
        .setStyle(ButtonStyle.Link)
        .setURL('https://docs.google.com/spreadsheets/d/1OGPkcXgCljorOcmPXe9O3mlZ9GdUQp-6RWpDQql25R8/edit#gid=0')
        .setDisabled(false);

    const row = new ActionRowBuilder()
        .addComponents(confirm, deleteButton);

    await targetChannel.send({ embeds: [embed], components: [row], ephemeral: false });
    await interaction.reply({ content: 'Сообщение отправлено', ephemeral: true });
}

async function sendMenuDeadZone(interaction, targetChannel) {
    
    const channel = interaction.channel;

    const embed = new EmbedBuilder()
        .setTitle('Dead Zone RolePlay')
        .setColor('#FFFFFF')
        .setDescription(`Прежде чем перейти к подаче заявки, ознакомтесь с правилами и лором проекта.`)
        .setImage('https://media1.tenor.com/m/ZL7cozaJo1QAAAAd/stalker.gif');

    const startTest = new ButtonBuilder()
        .setCustomId('DZ_StartQuest')
        .setLabel('Начать тест')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);

    const row = new ActionRowBuilder()
        .addComponents(startTest);

    await targetChannel.send({ embeds: [embed], components: [row], ephemeral: false });
    await interaction.reply({ content: 'Сообщение отправлено', ephemeral: true });
}

async function sendPartnerDeadZone(interaction, targetChannel) {
    
    const channel = interaction.channel;
    const avatar = interaction.guild.iconURL();

    const embed = new EmbedBuilder()
        .setTitle('Медиа партнерство')
        .setColor('#000000')
        .setDescription(`Увлеклись нашим проектом и параллельно этому снимаете увлекательные видео? Или проводите онлайн-трансляции? Тогда у вас есть шанс стать нашим медиа партнером!`)
        .setFooter({ text: `DEAD ZONE Team.`, iconURL: avatar });

    const startTest = new ButtonBuilder()
        .setCustomId('DZ_PartnerSet')
        .setLabel('Стать партнером')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);

    const row = new ActionRowBuilder()
        .addComponents(startTest);

    await targetChannel.send({ embeds: [embed], components: [row], ephemeral: false });
    await interaction.reply({ content: 'Сообщение отправлено', ephemeral: true });
}

async function sendReportDeadZone(interaction, targetChannel) {
    
    const channel = interaction.channel;

    const embed = new EmbedBuilder()
        //.setTitle('Dead Zone RolePlay')
        .setAuthor({ name: `☢️ Dead Zone RolePlay` })
        .setColor('#FFFFFF')
        .setDescription(`Текст`)
        .setImage('https://media1.tenor.com/m/ZL7cozaJo1QAAAAd/stalker.gif');

    const startTest = new ButtonBuilder()
        .setCustomId('DZ_ReportPlayer')
        .setLabel('Жалоба на игрока')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);

    const startTest2 = new ButtonBuilder()
        .setCustomId('DZ_ReportAdmin')
        .setLabel('Жалоба на администратора')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false);

    const row = new ActionRowBuilder()
        .addComponents(startTest, startTest2);

    await targetChannel.send({ embeds: [embed], components: [row], ephemeral: false });
    await interaction.reply({ content: 'Сообщение отправлено', ephemeral: true });
}