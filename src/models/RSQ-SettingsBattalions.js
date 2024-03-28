const { Schema, model } = require('mongoose');

const SettingBattalion = new Schema({
    guildID: {
        type: String,
        required: true,
        unique: true,
    },
    guildName: String,
    squadsBattalion: {
        type: String,
        default: '0',
    },
    raports: {
        nFight: {
            type: String,
            default: '1',
        },
        nRaports: {
            type: String,
            default: '1',
        },
        nGlobal: {
            type: String,
            default: '1',
        }
    },
    categoryID: {
        createChannelMenu: { // Категория где будет создаватся текстовый канал
            type: String,
            default: false,
        }
    },
    channelID: {
        wantedRaport: { // Объявление в розыск
            channel: { // Лог розыска
                type: String,
                default: false,
            }
        },
        reestrLog: {
            newDelo: { // Лог нового дела
                type: String,
                default: false,
            },
            updateDelo: { // Лог редакции готовго дела
                type: String,
                default: false,
            },
            oldNewDelo: { // Лог на попытку перепеси позывного
                type: String,
                default: false,
            }
        },
        raportsLog: {
            fightModer: { // Лог нового дела
                type: String,
                default: false,
            },
            fightUser: { // Лог редакции готовго дела
                type: String,
                default: false,
            }
        },
        baseMessage: { // Канал и сообщение штаба
            channel: { // Канал штаба
                type: String,
                default: false,
            },
            message: { // Сообщение штаба
                type: String,
                default: false,
            }
        }
    },
    radioConnection: {
        actualRadio: {
            type: String,
            default: '0',
        },
        numberRadio: {
            radio1: {
                type: String,
                default: '0',
            },
            radio2: {
                type: String,
                default: '0',
            },
            radio3: {
                type: String,
                default: '0',
            },
            radio4: {
                type: String,
                default: '0',
            },
            radio5: {
                type: String,
                default: '0',
            }
        }
    },
});

module.exports = model('RSQ-SettingsBattalion', SettingBattalion);
