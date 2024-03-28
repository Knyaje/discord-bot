const { ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { RSQ } = require("../../../config.json");
const { channelTimers, deleteChannelAndCancelTimer } = require("../../utils/activeArrays");
const { getMenuEmbed91, getMenuEmbed7 } = require("../../utils/RSQ-Menu");
const SettingBattalion = require("../../models/RSQ-SettingsBattalions");

module.exports = async (client, interaction) => {
    if (!interaction.isButton()) return;

    // Создаем канал
    if (interaction.customId === 'RSQ_BattalionMenu') {
        try {
            if (interaction.guildId === RSQ.menuOptions["91-battalion"].BattalionGuildID) {
                const guild = interaction.guild;

                try {
                    const existingData = await SettingBattalion.findOne({ guildID: interaction.guildId });
                    const category = await guild.channels.fetch(existingData.categoryID.createChannelMenu);
                    const member = interaction.member;
                    const userLogin = interaction.user.username.toLowerCase();
                    const cleanUserLogin = userLogin.replace(/[^a-zA-Z0-9-_]/g, '');
                    const channelName = `меню-${cleanUserLogin}`;

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

                    await interaction.reply({ content: `Для вас был создан текстовый канал для взаимодействия с меню --> ${textChannel}`, ephemeral: true });

                    const { embed, components } = getMenuEmbed91();

                    await textChannel.send({ content: `${member}`, embeds: [embed], components: components, ephemeral: false });
                
                    const channelId = textChannel.id;
                    channelTimers[textChannel.id] = setTimeout(() => {
                        deleteChannelAndCancelTimer(client, channelId);
                    }, RSQ.config.timeToDeleteChannel);
                } catch (error) {
                    console.error(`Произошла ошибка (#4520): ${error}`);   
                    
                    const embedErrorMessage = new EmbedBuilder()
                        .setTitle('Ошибка')
                        .setColor('#FF0000')
                        .setDescription('Произошла ошибка при выполнении (#4520)');

                    await interaction.reply({ embeds: [embedErrorMessage], ephemeral: true });
                }
            } else if (interaction.guildId === RSQ.menuOptions["7-battalion"].BattalionGuildID) {

                const guild = interaction.guild;

                try {
                    const existingData = await SettingBattalion.findOne({ guildID: interaction.guildId });
                    const category = await guild.channels.fetch(existingData.categoryID.createChannelMenu);
                    const member = interaction.member;
                    const userLogin = interaction.user.username.toLowerCase();
                    const cleanUserLogin = userLogin.replace(/[^a-zA-Z0-9-_]/g, '');
                    const channelName = `меню-${cleanUserLogin}`;

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

                    await interaction.reply({ content: `Для вас был создан текстовый канал для взаимодействия с меню --> ${textChannel}`, ephemeral: true });

                    const { embed, components } = getMenuEmbed7();

                    await textChannel.send({ content: `${member}`, embeds: [embed], components: components, ephemeral: false });
                
                    const channelId = textChannel.id;
                    channelTimers[textChannel.id] = setTimeout(() => {
                        deleteChannelAndCancelTimer(client, channelId);
                    }, RSQ.config.timeToDeleteChannel);
                } catch (error) {
                    console.error(`Произошла ошибка (#4520): ${error}`);   
                    
                    const embedErrorMessage = new EmbedBuilder()
                        .setTitle('Ошибка')
                        .setColor('#FF0000')
                        .setDescription('Произошла ошибка при выполнении (#4520)');

                    await interaction.reply({ embeds: [embedErrorMessage], ephemeral: true });
                }
            } else {
                const embed = new EmbedBuilder()
                    .setTitle('Ошибка')
                    .setColor('#FF0000')
                    .setDescription('Сервер не опознан (#1717)');

                await interaction.reply({ embeds: embed, ephemeral: true });
            }
        } catch (error) {
            console.error(`Произошла ошибка (#4521): ${error}`);   
            
            const embedErrorMessage = new EmbedBuilder()
                .setTitle('Ошибка')
                .setColor('#FF0000')
                .setDescription('Произошла ошибка при выполнении (#4521)');

            await interaction.reply({ embeds: [embedErrorMessage], ephemeral: true });
        }
    }

    // Назад в меню 91
    if (interaction.customId === 'returnmenu') {

        await interaction.message.delete();

        const { embed, components } = getMenuEmbed91();

        await interaction.channel.send({ embeds: [embed], components: components });
    }

    // Меню рапортов 91
    if (interaction.customId === 'raport') {

        await interaction.message.delete();
        const animatedEmoji4 = '<:pepe_detective:1169643164592779274>';

        const embed = new EmbedBuilder()
            .setTitle('Рапорта')
            .setColor('#910000')
            .setDescription(`${animatedEmoji4} Нажав кнопку *'Рапорт о боевом вылете'* необходимо будет указать участников, командира и дату проведения операции. Старайтесь писать описание как можно больше чтобы зацепить все ключевые моменты. В случае если в описании операции будет меньше трех предложений а также отсутствуют потери техники и бойцов - рапорт будет отклонен.`);

        const fight = new ButtonBuilder()
            .setCustomId('raportFight')
            .setLabel('Рапорт о боевом вылете')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(false);

        const ins = new ButtonBuilder()
            .setCustomId('raportIns')
            .setLabel('Отчет инструкторов')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(false);

        const med = new ButtonBuilder()
            .setCustomId('raportMed')
            .setLabel('Отчет медиков')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(false);

        const returns = new ButtonBuilder()
            .setCustomId('returnmenu')
            .setLabel('Назад в меню')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(false);

        const row = new ActionRowBuilder()
            .addComponents(fight, ins, med, returns);

        await interaction.channel.send({ embeds: [embed], components: [row] });({ embeds: [embed], components: [row], ephemeral: false });
    }
    
    // Рапорт инструктора 91
    if (interaction.customId === 'raportIns') {

        interaction.reply({content: "Функция пока еще в разработке", ephemeral: true });

    }

    // Рапорт медика 91
    if (interaction.customId === 'raportMed') {

        interaction.reply({content: "Функция пока еще в разработке", ephemeral: true });

    }

    // Учет корпуса
    if (interaction.customId === 'deloList') {

        try {
            if (interaction.guildId === RSQ.menuOptions["91-battalion"].BattalionGuildID) {

                await interaction.message.delete();

                const embed = new EmbedBuilder()
                    .setTitle('Учет корпуса')
                    .setColor('#910000')
                    .setDescription('Описание реестров');

                const cloneReestr91 = new ButtonBuilder()
                    .setCustomId('cloneReestr')
                    .setLabel('Основной реестр')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(false);

                const jediReestr91 = new ButtonBuilder()
                    .setCustomId('jediReestr91')
                    .setLabel('Реестр джедаев')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(false);

                const rcReestr91 = new ButtonBuilder()
                    .setCustomId('rcReestr91')
                    .setLabel('Реестр RC')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(false);

                const row = new ActionRowBuilder()
                    .addComponents(cloneReestr91, jediReestr91, rcReestr91);

                await interaction.channel.send({ embeds: [embed], components: [row] });
            
            } else if (interaction.guildId === RSQ.menuOptions["7-battalion"].BattalionGuildID) {
            
                await interaction.message.delete();

                const embed = new EmbedBuilder()
                    .setTitle('Учет батальона')
                    .setColor('#910000')
                    .setDescription('Описание реестров');

                const cloneReestr7 = new ButtonBuilder()
                    .setCustomId('cloneReestr')
                    .setLabel('Основной реестр')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(false);

                const jediReestr91 = new ButtonBuilder()
                    .setCustomId('jediReestr91')
                    .setLabel('Реестр джедаев')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(false);

                const rcReestr91 = new ButtonBuilder()
                    .setCustomId('rcReestr91')
                    .setLabel('Реестр RC')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(false);

                const row = new ActionRowBuilder()
                    .addComponents(cloneReestr7, jediReestr91, rcReestr91);

                await interaction.channel.send({ embeds: [embed], components: [row] });

            } else {
                const embed = new EmbedBuilder()
                        .setTitle('Ошибка')
                        .setColor('#FF0000')
                        .setDescription('Сервер не опознан (#1718)');

                await interaction.reply({ embeds: embed, ephemeral: true });
            }
        } catch (error) {
            console.error(`Произошла ошибка (#4524): ${error}`);   
            
            const embedErrorMessage = new EmbedBuilder()
                .setTitle('Ошибка')
                .setColor('#FF0000')
                .setDescription('Произошла ошибка при выполнении (#4524)');

            await interaction.reply({ embeds: [embedErrorMessage], ephemeral: true });
        }
    }

    // Меню - Основной реестр
    if (interaction.customId === 'cloneReestr') {

        try {
            if (interaction.guildId === RSQ.menuOptions["91-battalion"].BattalionGuildID) {

                await interaction.message.delete();

                const embed = new EmbedBuilder()
                    .setTitle('Основной реестр 91')
                    .setColor('#910000')
                    .setDescription('Описание реестра клонов');
            
                const cloneReestrCreate91 = new ButtonBuilder()
                    .setCustomId('cloneReestrCreate')
                    .setLabel('Новое дело')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(false);
            
                const cloneReestrEdit91 = new ButtonBuilder()
                    .setCustomId('cloneReestrEdit91')
                    .setLabel('Изменить существующее')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(false);
            
                const returns = new ButtonBuilder()
                    .setCustomId('returnmenu')
                    .setLabel('Назад в меню')
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(false);
            
                const row = new ActionRowBuilder()
                    .addComponents(cloneReestrCreate91, cloneReestrEdit91, returns);
        
                await interaction.channel.send({ embeds: [embed], components: [row] });({ embeds: [embed], components: [row], ephemeral: false });
                    
            } else if (interaction.guildId === RSQ.menuOptions["7-battalion"].BattalionGuildID) {
            
                await interaction.message.delete();

                const embed = new EmbedBuilder()
                    .setTitle('Основной реестр 7')
                    .setColor('#910000')
                    .setDescription('Описание реестра клонов');
            
                const cloneReestrCreate91 = new ButtonBuilder()
                    .setCustomId('cloneReestrCreate')
                    .setLabel('Новое дело')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(false);
            
                const cloneReestrEdit91 = new ButtonBuilder()
                    .setCustomId('cloneReestrEdit91')
                    .setLabel('Изменить существующее')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(false);
            
                const returns = new ButtonBuilder()
                    .setCustomId('returnmenu')
                    .setLabel('Назад в меню')
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(false);
            
                const row = new ActionRowBuilder()
                    .addComponents(cloneReestrCreate91, cloneReestrEdit91, returns);
            
                await interaction.channel.send({ embeds: [embed], components: [row] });({ embeds: [embed], components: [row], ephemeral: false });
        
            } else {
                const embed = new EmbedBuilder()
                    .setTitle('Ошибка')
                    .setColor('#FF0000')
                    .setDescription('Сервер не опознан (#1718)');

                await interaction.reply({ embeds: embed, ephemeral: true });
            }
        } catch (error) {
            console.error(`Произошла ошибка (#4524): ${error}`);   
            
            const embedErrorMessage = new EmbedBuilder()
                .setTitle('Ошибка')
                .setColor('#FF0000')
                .setDescription('Произошла ошибка при выполнении (#4524)');

            await interaction.reply({ embeds: [embedErrorMessage], ephemeral: true });
        }
    }

    // Меню - реестр джедаев 91
    if (interaction.customId === '2') {

        await interaction.message.delete();

        const embed = new EmbedBuilder()
            .setTitle('Учет корпуса')
            .setColor('#910000')
            .setDescription('Описание реестров');

        const cloneReestr91 = new ButtonBuilder()
            .setCustomId('cloneReestr91')
            .setLabel('Основной реестр')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(false);

        const jediReestr91 = new ButtonBuilder()
            .setCustomId('jediReestr91')
            .setLabel('Реестр джедаев')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(false);

        const returns = new ButtonBuilder()
            .setCustomId('returnmenu')
            .setLabel('Назад в меню')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(false);

        const row = new ActionRowBuilder()
            .addComponents(cloneReestr91, jediReestr91, returns);

        await interaction.channel.send({ embeds: [embed], components: [row] });({ embeds: [embed], components: [row], ephemeral: false });

    }

    // Меню - реестр РК
    if (interaction.customId === '1') {

        await interaction.message.delete();

        const embed = new EmbedBuilder()
            .setTitle('Учет корпуса')
            .setColor('#910000')
            .setDescription('Описание реестров');

        const cloneReestr91 = new ButtonBuilder()
            .setCustomId('cloneReestr91')
            .setLabel('Основной реестр')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(false);

        const jediReestr91 = new ButtonBuilder()
            .setCustomId('jediReestr91')
            .setLabel('Реестр джедаев')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(false);

        const rcReestr91 = new ButtonBuilder()
            .setCustomId('rcReestr91')
            .setLabel('Реестр RC')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(false);

        const row = new ActionRowBuilder()
            .addComponents(cloneReestr91, jediReestr91, rcReestr91);

        await interaction.channel.send({ embeds: [embed], components: [row] });({ embeds: [embed], components: [row], ephemeral: false });

    }
};
