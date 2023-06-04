const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campaignSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  chars: [{
    type: Schema.Types.ObjectId,
    ref: 'Chars'
  }],
  charNum: {
    type: Number
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerName: {
    type: String,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Campaign', campaignSchema);