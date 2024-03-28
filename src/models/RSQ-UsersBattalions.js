const { Schema, model } = require('mongoose');

const UserBattalion = new Schema({
    guildID: String,
    guildName: String,
    name: {
        type: String,
        required: true,
        unique: true,
    },
    userId: String,
    structure: String,
    config: {
        wantedSet: {
            type: Boolean,
            default: false
        }
    },
    info: {
        number: String,
        dateRankUP: String,
        dateV: String,
        spec: String,
        bso: String,
        squad: String,
        job: String,
        rank: String,
        timeMoscow: String
    },
    battle: {
        commandFight: {
            type: String,
            default: '0'
        },
        fight: {
            type: String,
            default: '0'
        },
        fightForRank: {
            type: String,
            default: '0'
        },
        lastDateFight: {
            type: String,
            default: ''
        }
    },
    training: {
        trainCreate: {
            type: String,
            default: '0'
        },
        train: {
            type: String,
            default: '0'
        },
        lastDateTrain: {
            type: String,
            default: ''
        },
    },
    instructions: {
        insOB: {
            type: String,
            default: '0'
        },
        insEkz: {
            type: String,
            default: '0'
        },
        lastDateINS: {
            type: String,
            default: ''
        }
    },
    guardInfo: {
        wanted: {
            type: Boolean,
            default: false
        },
        violations: [{
            messageId: String,
            messageURL: String,
            guardName: String,
            guardId: String,
            targetName: String,
            targetId: String,
            codex: String,
            info: String,
            wanted: String,
            status: {
                type: Boolean,
                default: true
            }
        }]
    }
});

module.exports = model('RSQ-UsersBattalion', UserBattalion);