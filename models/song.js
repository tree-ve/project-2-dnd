const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const songSchema = new Schema({
name: {
    type: String,
    required: true,
    unique: true
},
description: {
    type: String
},
url: {
    type: String,
    required: true,
    unique: true
},
user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
},
userName: {
    type: String,
},
campaigns: [{
    type: Schema.Types.ObjectId,
    ref: 'Campaign'
}],
}, {
    timestamps: true
});

module.exports = mongoose.model('Song', songSchema);