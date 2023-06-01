const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classSchema = new Schema({
  class: {
    type: String,
    required: true,
    // enum: ['artificer', 'barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk', 'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard'],
    enum: classes
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Class', classSchema);

const classes = [
  'artificer',
  'barbarian',
  'bard',
  'cleric',
  'druid',
  'fighter',
  'monk',
  'paladin',
  'ranger',
  'rogue',
  'sorcerer',
  'warlock',
  'wizard'
]

// const charClass = {
//     type: String,
//     required: true,
//     enum: ['artificer', 'barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk', 'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard'],
// };

// module.exports = mongoose.model('Class', charClass);