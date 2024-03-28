const { Schema, model } = require('mongoose');

const answerSchema = new Schema({
    userId: String,
    userAvatar: String,
    moderatorMessageId: String,
    moderatorChannelId: String,
    answers: Object,
    personalInfo: {
        name: String,
        pozivnoy: String,
        years: String
    }
});

module.exports = model('Answer', answerSchema);
