const Char = require('../models/char');
const Campaign = require('../models/campaign');
const User = require('../models/user');

module.exports = {
  index,
  show,
  new: newChar,
  create,
  delete: deleteChar
};

async function index(req, res) {
  const chars = await Char.find({});
  res.render('chars/index', { title: 'My Characters', chars });
}

async function deleteChar(req,res) {
  console.log('req.params.id ->', req.params.id)
  console.log('req.user._id ->', req.user._id)
  const user = await User.findOne({ 'users._id': req.params.id, 'chars.user': req.user._id});
  console.log('user.chars ->', user.chars);
  if (!user) return res.redirect('/chars');
  // user.chars.remove(req.params.id)
  // await user.save();
  res.redirect('/chars');
}

async function show(req, res) {
  const char = await Char.findById(req.params.id);//.populate('campaign');
  console.log(req.params.id);
  console.log(char);
  // const campaigns = await Campaign.find({ _id: { $nin: char.campaign } }).sort('name');
  // res.render('chars/show', { title: char.name, char, campaigns });
  res.render('chars/show', { title: char.name, char });
  // res.render(`chars/${char._id}`, { title: char.name });
}

function newChar(req, res) {
  // We'll want to be able to render an  
  // errorMsg if the create action fails
  res.render('chars/new', { title: 'New Character', errorMsg: '' });
}

// async function create(req, res) {
//   // convert nowShowing's checkbox of nothing or "on" to boolean
//   // req.body.nowShowing = !!req.body.nowShowing;
//   // Remove empty properties so that defaults will be applied
//   for (let key in req.body) {
//     if (req.body[key] === '') delete req.body[key];
//   }
//   try {
//     // Update this line because now we need the _id of the new movie
//     const char = await Char.create(req.body);
//     // Redirect to the new movie's show functionality 
//     res.redirect(`/chars/${char._id}`, { title: 'All Characters - post create' });
//   } catch (err) {
//     // Typically some sort of validation error
//     console.log(err);
//     res.render('chars/new', { title: 'New Char broke', errorMsg: err.message });
//   }
// }

async function create(req, res) {
  const user = await User.findById(req.params.id);

  console.log('req.params.id ->', req.params.id)
  console.log('user ->', user)
  // Add the user-centric info to req.body (the new review)
  req.body.user = req.user._id;
  console.log('req.body.user ->', req.body.user)
  // req.body.userName = req.user.name;
  // req.body.userAvatar = req.user.avatar;

  // We can push (or unshift) subdocs into Mongoose arrays
  console.log('req.body ->', req.body)
  const char = await Char.create(req.body);
  // ? user.chars.push(req.body);
  try {
    await user.save();
    res.redirect(`/chars/${char._id}`, { title: char.name, char });
    // res.redirect(`/chars`, { title: 'All Characters - post create' });
    // res.redirect(`/chars/${user._id}`, { title: 'All Characters - post create' });
  } catch (err) {
    console.log(err);
    res.render('chars/new', { title: 'New Char broke', errorMsg: err.message });
  }
  // Step 5:  Respond to the Request (redirect if data has been changed)
  // res.redirect(`/chars`);
  res.redirect(`/chars/${char._id}`);
}