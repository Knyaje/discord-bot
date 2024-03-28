const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const UserBattalion = require('../../models/RSQ-UsersBattalions');
const { RSQ } = require("../../../config.json");
const { getInfoDBStructure } = require("../../utils/RSQ-Menu");

module.exports = {
    name: "profile",
    description: "Профиль",
    deleted: false,
    devOnly: false,
    testOnly: false,
    levelsystem: false,
    rsq_battalions: true,
    options: [
        {
            name: 'список',
            description: 'Выведет список персонажей которые принадлежат указанному вами',
            type: ApplicationCommandOptionType.User,
            required: false
        },
        {
            name: 'данные',
            description: 'Написать имя',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],

    callback: async (client, interaction) => {
        try {
            if (interaction.options.get('данные')) {
                const allowedRoles = ['1032184961484193807', 'роль2_ID', 'роль3_ID']; // Массив с ID разрешенных ролей

                // Проверяем, есть ли у пользователя хотя бы одна из разрешенных ролей
                const hasAllowedRole = interaction.member.roles.cache.some(role => allowedRoles.includes(role.id));

                if (hasAllowedRole) {
                    // Если выбрана опция "name", находим пользователя по имени и отображаем его информацию
                    const targetName = interaction.options.getString('данные');
                    const user = await UserBattalion.findOne({ name: targetName }).exec();

                    if (!user) {
                        const embedErrorMessage = new EmbedBuilder()
                            .setTitle('Ошибка')
                            .setColor('#FF0000')
                            .setDescription('Пользователь с указанным именем не найден');

                        await interaction.reply({ embeds: [embedErrorMessage], ephemeral: true });
                        return;
                    }

                    const wantedStatus = user.guardInfo.wanted ? '\`\`\`⁣                 🚨 ОБЪЯВЛЕН В РОЗЫСК 🚨                ⁣\`\`\`' : 'Не объявлен';
                    const structureDescription = getInfoDBStructure(user);

                    const fields = [
                        user.guardInfo.wanted ? { name: '⁣ ', value: `${wantedStatus}` } : null,
                        { name: '⁣ ', value: `**Профиль:** <@${user.userId}>\n**Структура:** *${structureDescription}*\n**Должность:** *${user.info.job}*` },
                        { name: 'Данные', value: `\`\`\`Номер: ${user.info.number}\nПозывной: ${user.name}\nЗвание: ${user.info.rank}\nСпец-ия: ${user.info.spec}\`\`\``, inline: true },
                        { name: 'Положение', value: `\`\`\`⁣БСО: ${user.info.bso}\nВремя МСК: ${user.info.timeMoscow}\nОтряд: ${user.info.squad}\`\`\``, inline: true },
                        { name: 'Боевой вылет', value: `\`\`\`КМД: ${user.battle.commandFight}\nУчастие: ${user.battle.fight}\nНа звании: ${user.battle.fightForRank}\nД: ${user.battle.lastDateFight}\`\`\``, inline: true },
                        { name: 'Тренировки', value: `\`\`\`Проведено: ${user.training.trainCreate}\nУчастие: ${user.training.train}\nД: ${user.training.lastDateTrain}\`\`\``, inline: true },
                        { name: 'Инструкторская', value: `\`\`\`Обучено: ${user.instructions.insOB}\nЭкзаменировано: ${user.instructions.insEkz}\nД: ${user.instructions.lastDateINS}\`\`\``, inline: true },
                        user.guardInfo.wanted ? { name: '⁣ ', value: `${wantedStatus}` } : null
                    ].filter(field => field !== null);
                    
                    const embedData = new EmbedBuilder()
                        .setColor('#00FF00')
                        .addFields(fields);
                        
                    await interaction.reply({ embeds: [embedData], ephemeral: true });
                } else {
                    const targetName = interaction.options.getString('данные');
                    const user = await UserBattalion.findOne({ name: targetName }).exec();

                    if (!user) {
                        const embedErrorMessage = new EmbedBuilder()
                            .setTitle('Ошибка')
                            .setColor('#FF0000')
                            .setDescription('Пользователь с указанным именем не найден');

                        await interaction.reply({ embeds: [embedErrorMessage], ephemeral: true });
                        return;
                    }

                    getInfoDBStructure(user)

                    const embedData = new EmbedBuilder()
                        .setTitle(`Данные дела ${user.name}`)
                        .setColor('#00FF00')
                        .setDescription(`**Структура:** *${structureDescription}*\n**Должность:** *${user.info.job}*`)
                        .addFields(
                            { name: 'Данные', value: `⁣ Номер: *${user.info.number}*\n⁣ Позывной: *${user.name}*\n⁣ Звание: *${user.info.rank}*\n⁣ Специализация: *${user.info.spec}*`, inline: true},
                            { name: 'Положение', value: `⁣ БСО: *${user.info.bso}*\n⁣ Время МСК: *${user.info.timeMoscow}*\n⁣ Отряд: *${user.info.squad}*`, inline: true},
                            { name: '\u200b', value: '\u200b', inline: true },
                            { name: 'Боевой вылет', value: `⁣ Командование: *${user.battle.commandFight}*\n⁣ Участие: *${user.battle.fight}*\n На текущем звании: *${user.battle.fightForRank}*\n⁣ Д: *${user.battle.lastDateFight}*`, inline: true},
                            { name: 'Тренировки', value: `⁣ Проведено: *${user.training.trainCreate}*\n⁣ Участие: *${user.training.train}*\n⁣ Д: *${user.training.lastDateTrain}*`, inline: true},
                            { name: 'Инструкторская', value: `⁣ Проведено обучений: *${user.instructions.insOB}*\n⁣ Проведено экзаменов: *${user.instructions.insEkz}*\n⁣ Д: *${user.instructions.lastDateINS}*`, inline: true},
                        );

                    await interaction.reply({ embeds: [embedData], ephemeral: true });
                }
            } else if (interaction.options.get('список')) {
                const targetUser = interaction.options.getUser('список');
                const users = await UserBattalion.find({ userId: targetUser.id }).exec();

                if (users.length === 0) {
                    const embedErrorMessage = new EmbedBuilder()
                        .setTitle('Ошибка')
                        .setColor('#FF0000')
                        .setDescription('Не найдено персонажей, принадлежащих указанному пользователю');

                    await interaction.reply({ embeds: [embedErrorMessage], ephemeral: true });
                    return;
                }

                let structureDescription;

                const embedList = new EmbedBuilder()
                    .setTitle('Список персонажей')
                    .setColor('#00FF00');

                users.forEach(user => {
                    switch (user.structure) {
                        case '7':
                            structureDescription = `7-й батальон`;
                            break;
                        case '91':
                            structureDescription = `91-й батальон`;
                            break;
                        default:
                            structureDescription = user.structure; // Выводим значение как есть, если не совпадает ни с одним кейсом
                    }

                    embedList.addFields({ name: user.name, value: `⁣ Структура: *${structureDescription}*\n⁣ Номер: *${user.info.number}*\n⁣ Звание: *${user.info.rank}*`});
                });

                await interaction.reply({ embeds: [embedList], ephemeral: true });
            } else {
                // Если не выбраны ни опция "name", ни "mention", выводим сообщение об ошибке
                const embedErrorMessage = new EmbedBuilder()
                    .setTitle('Ошибка')
                    .setColor('#FF0000')
                    .setDescription('Необходимо выбрать одну из опций');

                await interaction.reply({ embeds: [embedErrorMessage], ephemeral: true });
            }
        } catch (error) {
            console.error(`Произошла ошибка (#8575): ${error}`);

            const embedErrorMessage = new EmbedBuilder()
                .setTitle('Ошибка')
                .setColor('#FF0000')
                .setDescription('Произошла ошибка при выполнении команды (#8575)');

            await interaction.reply({ embeds: [embedErrorMessage], ephemeral: true });
        }
    }
};