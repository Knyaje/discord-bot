const { Schema, model } = require('mongoose');

const guildSettingsSchema = new Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  guildName: {
    type: String,
  },
  levelSystemEnabled: {
    type: Boolean,
    default: false,
  },
  leaveGuildMember: {
    enable: {
      type: Boolean,
      default: false,
    },
    channelLog: {
      type: String,
      default: false
    }
  },
  JoinGuildRole: {
    enable: {
      type: Boolean,
      default: false,
    },
    roleId: {
      type: String,
      default: false
    },
  },
  JoinGuildMember: {
    enable: {
      type: Boolean,
      default: false,
    },
    channelLog: {
      type: String,
      default: false
    },
  },
  raports: {
    categoryRaport: {
        type: String,
        default: false,
    },
    channelMod: {
        type: String,
        default: false,
    }
  }
});

module.exports = model('GuildSettings', guildSettingsSchema);