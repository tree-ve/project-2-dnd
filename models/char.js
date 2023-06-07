const mongoose = require('mongoose');
// optional shortcut to the mongoose.Schema class
const Schema = mongoose.Schema;

const charSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    race: {
        type: String,
        required: true,
        // enum: ['']
    },
    level: {
        type: Number,
        min: 1,
        max: 20,
        required: true
    },
    // class: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Class',
    //     required: true
    // },
    class: {
        type: String,
        required: true,
        enum: ['artificer', 'barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk', 'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard'],
    },
    hp: {
        type: Number,
        required: true,
        min: 1
    },
    ac: {
        type: Number,
        required: true,
        min: 1
    },
    str: {
        type: Number,
        required: true,
        min: 0,
        default: 10,
        max: 20,
    },
    dex: {
        type: Number,
        required: true,
        min: 0,
        default: 10,
        max: 20,
    },
    con: {
        type: Number,
        required: true,
        min: 0,
        default: 10,
        max: 20,
    },
    int: {
        type: Number,
        required: true,
        min: 0,
        default: 10,
        max: 20,
    },
    wis: {
        type: Number,
        required: true,
        min: 0,
        default: 10,
        max: 20,
    },
    cha: {
        type: Number,
        required: true,
        min: 0,
        default: 10,
        max: 20,
    },
    campaign: {
        type: Schema.Types.ObjectId,
        ref: 'Campaign',
        unique: true
    }
  }, {
    timestamps: true
  });
  
  // Compile the schema into a model and export it
  module.exports = mongoose.model('Char', charSchema);