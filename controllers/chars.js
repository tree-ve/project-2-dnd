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
    ...body,
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

async function addToCampaign(req, res, next) {
  console.log('chars addToCampaign')
  const campaign = await Campaign.findById(req.params.id);
  const char = await Char.findById(req.body.charId);
  // ? campaign.chars.push(req.body.chars);
  try {
    char.campaign = {}
    char.campaign = campaign
    await char.save();
    res.redirect(`/campaigns/${campaign._id}`);
  } catch (err) {
    res.redirect(`/campaigns/${campaign._id}`);
    next()
  }
}

async function removeFromCampaign(req, res) {
  console.log('chars removeFromCampaign')
  const campaign = await Campaign.findById(req.params.id);
  const char = await Char.findById(req.body.charId);
  for (const key in char.campaign) {
    char.campaign = undefined;
  }
  await char.save();
  await campaign.save();
  res.redirect(`/campaigns/${campaign._id}`);
}

async function index(req, res) {
  console.log('chars index');
  try {
    const chars = await Char.find({ user: req.user._id}).sort('level');
    const campaigns = await Campaign.find({});
    if (req.user === undefined) {
      console.log('user undefined')
      res.render('', { title: 'D&D Organiser', errorMsg: err.message });
    }
    res.render('chars/index', { title: 'My Characters', chars, campaigns }); 
  } catch (err) {
    if (req.user === undefined) {
      console.log('user undefined')
      res.render('', { title: 'D&D Organiser', errorMsg: err.message });
    }
  }
}

async function deleteChar(req, res) {
  console.log('chars delete');
  const user = await User.findById(req.user._id)
  const char = await Char.findById(req.params.id);
  if (!char) {
    console.log('not valid user?');
    return res.redirect('/chars')
  };
  user.chars.remove(char._id)
  await user.save()
  console.log(user.chars)
  char.deleteOne(
    { _id: req.params.id }
  )
  res.redirect('/chars');
}

async function show(req, res) {
  console.log('chars show');
  try {
    const user = await User.findById(req.user._id);
    const char = await Char.findById(req.params.id);
    const activeCampaign = await Campaign.find({ _id: char.campaign });
    const campaigns = await Campaign.find({ _id: { $nin: char.campaign } });
    res.render('chars/show', { title: char.name, char, campaigns, activeCampaign });
  } catch (err) {
    if (req.user === undefined) {
      console.log('user undefined')
      res.render('', { title: 'D&D Organiser', errorMsg: err.message });
    }
  }
}

function newChar(req, res) {
  console.log('chars new');
  res.render('chars/new', { title: 'New Character', errorMsg: '' });
}


async function create(req, res) {
  console.log('chars create');
  try {
    const user = await User.findById(req.params.id);

    console.log('req.params.id ->', req.params.id)
    console.log('user ->', user)
    req.body.user = req.user._id;
    console.log('req.body.user ->', req.body.user)
    console.log('req.body ->', req.body)
    const char = await Char.create(req.body);
    user.chars.push(char);
    await user.save();
    res.redirect(`/chars/${char._id}`, { title: char.name, char });
  } catch (err) {
    console.log('err', err.message);
    res.render('chars/new', { title: 'New Character', errorMsg: err.message });
  }
}

async function edit(req, res, next) {
  console.log('chars edit')
  try {
    const char = await Char.findById(req.params.id);
    res.render('chars/edit', { title: `Edit Character`, char, errorMsg: '' });
  } catch (error) {
    next()
  }
}

async function update(req, res) {
  console.log('chars update')
  console.log(req.params.id);
  const char = await Char.findById(req.params.id);
  const activeCampaign = await Campaign.find({ _id: char.campaign })
  try {
    const charInfo = await Char.findById(req.params.id);
    const body = formatBody(req.body);
    Object.assign(charInfo, body);
    await charInfo.save()
    res.render('chars/show', { title: charInfo.name, char: charInfo.toObject(), activeCampaign })
  } catch (err) {
    res.render('chars/edit', { title: `Edit Character: ${char.name}`, char, errorMsg: err.message });
  }
}