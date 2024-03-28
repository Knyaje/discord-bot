module.exports = {
    name: 'ping',
    description: 'Узнать время отклика бота',
    deleted: false,
    devOnly: false,
    testOnly: false,
  
    callback: async (client, interaction) => {
      await interaction.deferReply();
  
      const reply = await interaction.fetchReply();
  
      const ping = reply.createdTimestamp - interaction.createdTimestamp;
  
      interaction.editReply(
        `Я твою мать ебал.. \`[ Client: ${ping}ms | Websocket: ${client.ws.ping}ms ]\``
      );
    },
};  