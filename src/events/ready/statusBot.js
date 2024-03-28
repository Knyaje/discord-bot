const { ActivityType } = require('discord.js');

module.exports = async (client) => {

    function setStatus() {
        client.user.setPresence({
            activities: [{
                name: 'ваши проблемы',
                type: ActivityType.Streaming,
                url: 'https://www.twitch.tv/pozi7ron'
            }],
            status: 'online'
        });
    }

    setStatus();
};