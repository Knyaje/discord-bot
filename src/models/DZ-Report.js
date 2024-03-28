const { Schema, model } = require('mongoose');

const ChannelReportSchema = new Schema({
    userId: String,
    channelID: {
        type: String,
        required: true,
    },
    moderatorMessageId: String,
    info: {
        complaintName: String,
        complaintDate: String,
        ComplaintInfo: String
    }
});

module.exports = model('DZ-Report', ChannelReportSchema);
