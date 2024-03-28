const { Schema, model } = require('mongoose');

const RaportFight = new Schema({
    reportNumber: {
        type: Number,
        required: true,
        unique: true
    },
    moderatorMessageId: String,
    moderatorChannelId: String,
    userMessageId: String,
    userChannelId: String,
    reporter: {
        id: {
            type: String,
            required: true
        },
        rank: {
            type: String,
            required: true
        },
        number: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    commander: {
        id: {
            type: String,
            required: true
        },
        rank: {
            type: String,
            required: true
        },
        number: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    group: [{
        id: {
            type: String,
            required: true
        },
        rank: {
            type: String,
            required: true
        },
        number: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    }],
    operationDescription: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
});

module.exports = model('RSQ-RaportsFight', RaportFight);
