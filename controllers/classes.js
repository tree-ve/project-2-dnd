const Class = require('../models/class');
const Char = require('../models/char');

module.exports = {
  new: newClass,
  create,
  addToChar
};

async function addToChar(req, res) {
  const char = await Char.findById(req.params.id);
  // The charaddToChar array holds the class's ObjectId (referencing)
  console.log('req.body.classId ', req.body.classId)
  char.class.push(req.body.classId);
  await char.save();
  res.redirect(`/chars/${char._id}`);
}