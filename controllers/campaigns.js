const Char = require('../models/char');
const Campaign = require('../models/campaign');
const User = require('../models/user');
const Song = require('../models/song');

module.exports = {
  index,
  show,
  new: newCampaign,
  create,
  delete: deleteCampaign,
  edit,
  update,
  addToChar
};

async function index(req, res) {
  console.log('campaign/index')
  const campaigns = await Campaign.find({});
  try {
    // console.log(req.user)
    const user = await User.findById(req.user._id);
    // console.log(user)
    for (i = 0; i < campaigns.length; i++) {
      const campaignChars = await Char.find({ campaign: campaigns[i]._id });
      const num = campaignChars.length
      campaigns[i].charNum = num
    }
    res.render('campaigns/index', { title: 'My Campaigns', campaigns });
  } catch (err) {
    if (req.user === undefined) {
      console.log('5');
      console.log('user undefined')
      console.log(err.message)
      res.render('', { title: 'D&D Organiser', errorMsg: err.message });
    }
    res.render('campaigns/index', { title: 'My Campaigns', campaigns, errorMsg: err.message });
  }
}

async function addToChar(req, res) {
  console.log('campaign addToChar')
  const char = await Char.findById(req.params.id);
  // console.log('char', char)
  console.log('req.params.id ->', req.params.id)
  // console.log('user ->', user)
  console.log('req.body.campaignId ->', req.body.campaignId) // maybe change chars back to charId
  // console.log('req ->', req)
  // The chars array holds the characters's ObjectId (referencing)
  const campaign = await Campaign.findById(req.body.campaignId); // maybe change chars back to charId
  console.log('campaign ->', campaign);
  console.log('req.body ->', req.body)
  // char.campaign.push(req.body.chars);
  
  // char.campaign = campaign
  // await char.save();
  console.log('char ->', char)
  console.log('req.params.id ->', req.params.id)
  console.log('char._id ->', char._id)
  console.log('char.id ->', char.id)
  // res.render(`/chars/${char.id}`, char);
  res.redirect(`/chars/${char.id}`);
  console.log('char', char)
}

async function deleteCampaign(req, res) {
  console.log('campaign deleteCampaign');
  console.log('req.params.id ->', req.params.id)
  console.log('req.user._id ->', req.user._id)
  const user = await User.findOne({ 'user._id': req.params.id, 'chars.owner': req.user._id});
  const campaign = await Campaign.findById(req.params.id);
  const campaignChars = await Char.find({ campaign: req.params.id });
  // console.log('campaignChars', campaignChars);
  console.log(campaignChars.length);
  for (i = 0; i < campaignChars.length; i++) {
    // console.log(campaignChars[i]._id)
    const char = await Char.findById(campaignChars[i]._id)
    // console.log('1', char.name, char.campaign)
    // console.log('2', campaignChars[i].name, campaignChars[i].campaign)
    // campaignChars[i].campaign = undefined;
    char.campaign = undefined;
    // console.log('3', char.name, char.campaign)
    // console.log('4', campaignChars[i].name, campaignChars[i].campaign)
    await char.save();
  }
  // await campaignChars.save();
  
  if (!campaign) {
    console.log('not valid campaign?');
    return res.redirect('/campaigns')
  };

  campaign.deleteOne(
    { _id: req.params.id }
  )
  res.redirect('/campaigns');
}

async function show(req, res) {
  console.log('campaign/show')
  try {
    const campaign = await Campaign.findById(req.params.id);
    const user = await User.findById(req.user._id);
    const userCharsArr = []
    for (i = 0; i < req.user.chars.length; i++) {
      const userChar = await Char.findById(req.user.chars[i]);
      userCharsArr.push(userChar)
    }
    const userSongsArr = []
    for (i = 0; i < req.user.songs.length; i++) {
      const userSong = await Song.findById(req.user.songs[i]);
      userSongsArr.push(userSong)
    }
    const chars = await Char.find({ _id: userCharsArr });
    const songs = await Song.find({ _id: userSongsArr });
    const usersChars = await Char.find({ campaign: { $exists: false } });
    const usersSongs = await Song.find({ campaigns: { $nin: campaign } });
    // const usersSongs = await Song.find({});
    const campaignChars = await Char.find({ campaign: campaign }).sort('name');
    const campaignSongs = await Song.find({ campaigns: campaign });
    // console.log(campaignSongs)
    // console.log(usersSongs)
    res.render('campaigns/show', { title: campaign.name, campaign, chars, songs, usersChars, usersSongs, campaignChars, campaignSongs });
  } catch (err) {
    console.log('err', err);
    // console.log(req.user)
    if (req.user === undefined) {
      console.log('user undefined')
      res.render('', { title: 'D&D Organiser', errorMsg: err.message });
    }
    console.log('penultimate campaign show err');
    res.render('campaigns', { title: 'My Campaigns', errorMsg: err.message });
  }
}

function newCampaign(req, res) {
  console.log('campaign newCampaign')
  // We'll want to be able to render an  
  // errorMsg if the create action fails
  res.render('campaigns/new', { title: 'New Campaign', errorMsg: '' });
}

async function create(req, res) {
  console.log('campaign create');
  try {
    const user = await User.findById(req.params.id);
    req.body.owner = req.user._id;
    req.body.ownerName = req.user.name;
    const campaign = await Campaign.create(req.body);
    // ? user.chars.push(req.body);
    await campaign.save();
    const campaigns = await Campaign.find({});
    // await campaigns.save();
    console.log('penultimate campaign create try');
    // res.redirect(`/campaigns/${campaign._id}`, { title: campaign.name, campaign });
    res.render('campaigns/index', { title: 'My Campaigns', campaigns });
  } catch (err) {
    console.log('err', err.message);
    console.log('penultimate campaign create err');
    res.render('campaigns/new', { title: 'New Campaign', errorMsg: err.message });
  }
}

async function edit(req, res, next) {
  console.log('campaign edit')
  try {
    const user = await User.findById(req.user._id);
    console.log(user._id, ' <- user._id')
    const campaign = await Campaign.findById(req.params.id);
    console.log(campaign.owner, ' <- campaign.owner')
    if (user._id === campaign.owner) {
      console.log('true');
    } else {
      console.log('false');
    }
    res.render('campaigns/edit', { title: `Edit Campaign: ${campaign.name}`, campaign, errorMsg: '' });
  } catch (error) {
    next()
  }
}

async function update(req, res) {
  console.log('campaign update')
  try {
    const campaign = await Campaign.findById(req.params.id);
    const usersChars = await Char.find({ campaign: { $exists: false } });
    const campaignChars = await Char.find({ campaign: campaign });
    const campaignInfo = await Campaign.findById(req.params.id);
    // const body = formatBody(req.body);
    Object.assign(campaignInfo, req.body);
    await campaignInfo.save()
    res.render('campaigns/show', { title: campaignInfo.name, campaign: campaignInfo.toObject(), usersChars, campaignChars })
  } catch (err) {
    res.render('campaign/edit', { title: `Edit Campaign:`, campaign, errorMsg: err.message });
  }
}