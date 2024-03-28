const BotSetting = require("../../models/Bot-Setting");

module.exports = async (client) => {
  try {
    const botSettings = await BotSetting.findOne();
    if (!botSettings) {
      await BotSetting.create({ enableMenuRSQ: true });
      console.log("♡ Настройки бота успешно созданы");
    } else {
      console.log("♡ Настройки бота успешно загружены");
    }
  } catch (error) {
    console.error("Ошибка при проверке и создании настроек бота #9999:", error);
  }
};
