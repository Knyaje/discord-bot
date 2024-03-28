const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  guildID: String,
  guildName: String,
  userID: String,
  username: String,
  experience: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 0,
  },
  registeredAt: { 
    type: Number, 
    default: Date.now(),
  },
  infractions: [
    {
      type: String,
      reason: String,
      timestamp: { type: Date, default: Date.now() },
      active: { type: Boolean, default: true }
    }
  ],
  currency: {
    coins: { type: Number, default: 0 },
    gems: { type: Number, default: 0 }
  },
  inventory: [String],
  boosts: [{
    type: String,
    expiration: { type: Date, default: null }
  }],
});

module.exports = model("User", userSchema);