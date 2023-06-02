// const { format } = require('morgan');
const Campaign = require('../models/campaign');
const Char = require('../models/char');
// const Campaign = require('../models/campaign');
const User = require('../models/user');
const { all } = require('../routes/chars');

module.exports = {
  index,
  show,
  new: newChar,
  create,
  edit,
  update,
  delete: deleteChar,
  addToCampaign
};

function formatBody(body){
  return { 
    ...body, // body as it was in the original request
    // nowShowing: !!body.nowShowing, // update the nowShowing field to it's boolean value
    level: parseInt(body.level),
    hp: parseInt(body.hp),
    ac: parseInt(body.ac),
    str: parseInt(body.str),
    dex: parseInt(body.dex),
    con: parseInt(body.con),
    int: parseInt(body.int),
    wis: parseInt(body.wis),
    cha: parseInt(body.cha),
  }
}

async function addToUser(req, res) {

}

async function addToCampaign(req, res) {
  console.log('addToCampaign')
  const campaign = await Campaign.findById(req.params.id);
  console.log('campaign', campaign)
  console.log('req.params.id ->', req.params.id)
  // console.log('user ->', user)
  console.log('req.body.charId ->', req.body.charId)
  // The chars array holds the characters's ObjectId (referencing)
  const charName = Char.findById(req.body.charId);
  console.log(charName);
  campaign.chars.push(req.body.charId);
  await campaign.save();
  res.redirect(`/campaigns/${campaign._id}`);
  console.log('campaign', campaign)
}

async function index(req, res) {
  console.log('index');
  const chars = await Char.find({});
  res.render('chars/index', { title: 'My Characters', chars });
}

async function deleteChar(req, res) {
  console.log('delete');
  // console.log('req.params.id ->', req.params.id)
  // console.log('req.user._id ->', req.user._id)
  // const user = await User.findOne({ 'user._id': req.params.id, 'chars.user': req.user._id});
  // const char = await Char.findOne({ _id: req.params.id, 'chars.user': req.user._id});
  // const char = await Char.findOne({ _id: req.params.id })
  const char = await Char.findById(req.params.id);
  if (!char) {
    console.log('not valid user?');
    return res.redirect('/chars')
  };
  // char.remove(req.params.id)
  char.deleteOne(
    { _id: req.params.id }
  )
  // await user.save();
  res.redirect('/chars');
}

async function show(req, res) {
  console.log('show');
  const char = await Char.findById(req.params.id);//.populate('campaign');
  const allChars = Char.findOne({ _id: req.params.id, user: req.user._id })
  //const user = await User.findOne({ 'user._id': req.params.id, 'chars.user': req.user._id});
  console.log(allChars)
  // console.log(allChars);
  // console.log(req.params.id);
  // console.log(char);
  // const campaigns = await Campaign.find({ _id: { $nin: char.campaign } }).sort('name');
  // res.render('chars/show', { title: char.name, char, campaigns });
  res.render('chars/show', { title: char.name, char });
  // res.render(`chars/${char._id}`, { title: char.name });
}

function newChar(req, res) {
  console.log('new');
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
  console.log('create');
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

async function edit(req, res, next) {
  console.log('edit')
  try {
    const char = await Char.findById(req.params.id);
    res.render('chars/edit', { title: `Edit Character: ${char.name}`, char, errorMsg: '' });
  } catch (error) {
    next()
  }
}

async function update(req, res) {
  console.log('update')
  const char = await Char.findById(req.params.id);
  try {
    const charInfo = await Char.findById(req.params.id);
    const body = formatBody(req.body);
    Object.assign(charInfo, body);
    await charInfo.save()
    res.render('chars/show', { title: charInfo.name, char: charInfo.toObject() })
  } catch (err) {
    res.render('chars/edit', { title: `Edit Character: ${char.name}`, char, errorMsg: err.message });
  }
}