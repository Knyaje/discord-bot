const { Schema, model } = require('mongoose');

const autoRoleSchema = new Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  guildName: String,
  roleId: {
    type: String,
    required: true,
  },
});

module.exports = model('AutoRole', autoRoleSchema);
