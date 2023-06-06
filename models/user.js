const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  googleId: {
    type: String,
    required: true
  },
  email: String,
  avatar: String,
  chars: [{
    type: Schema.Types.ObjectId,
    ref: 'Char'
  }],
  songs: [{
    type: Schema.Types.ObjectId,
    ref: 'Song'
  }],
}, {
  timestamps: true
});


module.exports = mongoose.model('User', userSchema);