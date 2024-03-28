const areCommandsDifferent = require('../../utils/areCommandsDifferent');
const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client, guild) => {
    try {
        const localCommands = getLocalCommands();
        const applicationCommands = await getApplicationCommands(client, guild.id);

        for (const localCommand of localCommands) {
            const { name, description, options } = localCommand;
            const existingCommand = await applicationCommands.cache.find(
                (cmd) => cmd.name === name
            );

            if (existingCommand) {
                if (localCommand.deleted) {
                    await applicationCommands.delete(existingCommand.id);
                    console.log(`🗑 Команда удалена | ${name} на ${guild.name}`);
                    continue;
                }

                if (areCommandsDifferent(existingCommand, localCommand)) {
                    await applicationCommands.edit(existingCommand.id, {
                        description,
                        options,
                    });

                    console.log(`🔁 Команда обновлена | ${name} на ${guild.name}`);
                }
            } else {
                if (localCommand.deleted) {
                    console.log(
                        `⏩ Пропуск регистрации команды | ${name} поскольку она настроена на удаление для ${guild.name}`
                    );
                    continue;
                }

                await applicationCommands.create({
                    name,
                    description,
                    options,
                });

                console.log(`👍 Команда зарегистрирована | ${name} на ${guild.name}`);
            }
        }
    } catch (error) {
        console.log(`There was an error handling guild join event for guild ${guild.id}: ${error}`);
    }
};