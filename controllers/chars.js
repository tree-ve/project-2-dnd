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
  addToCampaign,
  removeFromCampaign
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
  console.log('req.body.charId ->', req.body.charId) // maybe change chars back to charId
  // console.log('req ->', req)
  // The chars array holds the characters's ObjectId (referencing)
  const char = await Char.findById(req.body.charId); // maybe change chars back to charId
  console.log('char ->', char);
  // ? campaign.chars.push(req.body.chars);
  char.campaign = {}
  console.log('char.campaign ->', char.campaign);
  char.campaign = campaign
  console.log('char.campaign ->', char.campaign);
  await char.save();
  console.log('char ->', char);
  res.redirect(`/campaigns/${campaign._id}`);
  console.log('campaign', campaign)
}

async function removeFromCampaign(req, res) {
  console.log('removeFromCampaign')
  const campaign = await Campaign.findById(req.params.id);
  console.log('campaign', campaign)
  console.log('req.params.id ->', req.params.id)
  // console.log('user ->', user)
  console.log('req.body.charId ->', req.body.charId) // maybe change chars back to charId
  console.log('req ->', req)
  // The chars array holds the characters's ObjectId (referencing)
  const char = Char.findById(req.body.charId); // maybe change chars back to charId
  // console.log(char);
  char.campaign = {}
  console.log('char.campaign ->', char.campaign);
  // campaign.chars.remove(req.body.chars);
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
  const user = await User.findById(req.user._id)
  const char = await Char.findById(req.params.id);
  if (!char) {
    console.log('not valid user?');
    return res.redirect('/chars')
  };
  // console.log(char)
  // console.log(user.chars)
  user.chars.remove(char._id)
  // user.chars = []
  await user.save()
  console.log(user.chars)
  char.deleteOne(
    { _id: req.params.id }
  )

  // await user.save();
  res.redirect('/chars');
}

async function show(req, res) {
  console.log('show');
  const char = await Char.findById(req.params.id);//.populate('campaign');
  const activeCampaign = await Campaign.find({ _id: char.campaign })
  const campaigns = await Campaign.find({ _id: { $nin: char.campaign } })// .sort('name');
  //!
  // const allChars = await Char.find({ user: req.user._id })
  // console.log(typeof(allChars))
  // // console.log(allChars[0])
  // // console.log(allChars[1])
  // console.log(allChars.length);
  // const user = await User.findById(req.user._id)
  // for (i = 0; i < allChars.length; i++) {
  //   console.log(i)
  //   // user.chars.push(allChars[i]);
  // }
  // // await user.save()
  // console.log(user);
  //!

  // console.log(req.params.id);
  console.log(char)
  console.log(activeCampaign);
  console.log(char.campaign)
  // const campaigns = await Campaign.find({ _id: { $nin: char.campaign } }).sort('name');
  // res.render('chars/show', { title: char.name, char, campaigns });
  res.render('chars/show', { title: char.name, char, campaigns, activeCampaign });
  // res.render(`chars/${char._id}`, { title: char.name });
}

function newChar(req, res) {
  console.log('new');
  // We'll want to be able to render an  
  // errorMsg if the create action fails
  res.render('chars/new', { title: 'New Character', errorMsg: '' });
}


async function create(req, res) {
  console.log('create');
  const user = await User.findById(req.params.id);

  console.log('req.params.id ->', req.params.id)
  console.log('user ->', user)
  // Add the user-centric info to req.body (the new review)
  req.body.user = req.user._id;
  console.log('req.body.user ->', req.body.user)
  // We can push (or unshift) subdocs into Mongoose arrays
  console.log('req.body ->', req.body)
  const char = await Char.create(req.body);
  // const body = formatBody(req.body);
  user.chars.push(char);
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