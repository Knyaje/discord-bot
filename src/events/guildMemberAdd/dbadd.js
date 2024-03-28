const User = require('../../models/User');

module.exports = async (client, member) => {
  try {
    let existingUser = await User.findOne({ guildID: member.guild.id, userID: member.id });
    if (existingUser) {
      // Обновляем существующего пользователя
      existingUser.guildName = member.guild.name;
      existingUser.username = member.user.tag;
      await existingUser.save();
      //console.log('User data updated');
    } else {
      // Создаем нового пользователя
      const newUser = new User({
        guildID: member.guild.id,
        guildName: member.guild.name,
        userID: member.id,
        username: member.user.tag
      });
      await newUser.save();
      //console.log('New user added to database');
    }
  } catch (err) {
    console.error(err);
  }
}