const { Schema, model } = require('mongoose');

const createChannelSchema = new Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  guildName: String,
  categoryID: {
    type: String,
    required: true,
  },
});

module.exports = model('CreateChannel', createChannelSchema);
