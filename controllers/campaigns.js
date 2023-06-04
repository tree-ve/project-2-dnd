const Char = require('../models/char');
const Campaign = require('../models/campaign');
const User = require('../models/user');

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
  // console.log(campaigns.length)
  // const campaignChars = await Char.find({ campaign: req.params.id });
  for (i = 0; i < campaigns.length; i++) {
    console.log('1: ', campaigns[i])
    const campaignChars = await Char.find({ campaign: campaigns[i]._id });
    const num = campaignChars.length
    campaigns[i].charNum = num
    console.log('2: ', campaignChars.length)
    console.log('3: ', campaigns[i])
    // Maybe assign this number to the now empty chars array in campaigns
    // await char.save();
    // await campaigns.save()
  }
  res.render('campaigns/index', { title: 'All Campaigns', campaigns });
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

  // await char.save();
  // await user.save();
  res.redirect('/campaigns');
}

async function show(req, res) {
  console.log('campaign/show')
  // Populate the cast array with performer docs instead of ObjectIds
  const campaign = await Campaign.findById(req.params.id);

  const user = await User.findById(req.user._id);
  const userCharsArr = []
  for (i = 0; i < req.user.chars.length; i++) {
    const userChar = await Char.findById(req.user.chars[i]);
    userCharsArr.push(userChar)
    // console.log(userChar.name)
  }
  const chars = await Char.find({ _id: userCharsArr });//   .sort('name');
  // const usersChars = await Char.find({ _id: { $nin: campaign.chars }, campaign: { $exists: false } });//   .sort('name');
  // const campaignChars = await Char.find({ _id: campaign.chars });//   .sort('name');
  const usersChars = await Char.find({ campaign: { $exists: false } });
  // console.log('usersChars -> ', usersChars)
  const campaignChars = await Char.find({ campaign: campaign });
  // console.log('campaignChars -> ', campaignChars)
  // console.log('campaign ->', campaign);
  // const chars = await Char.find({ _id: { $nin: campaign.chars } }).sort('name');
  res.render('campaigns/show', { title: campaign.name, campaign, chars, usersChars, campaignChars });
}

function newCampaign(req, res) {
  console.log('campaign newCampaign')
  // We'll want to be able to render an  
  // errorMsg if the create action fails
  res.render('campaigns/new', { title: 'New Campaign', errorMsg: '' });
}

async function create(req, res) {
  console.log('campaign create');
  const user = await User.findById(req.params.id);

  console.log('req.params.id ->', req.params.id)
  console.log('user ->', user)
  // Add the user-centric info to req.body (the new review)
  req.body.owner = req.user._id;
  req.body.ownerName = req.user.name;
  console.log('req.body.user ->', req.body.owner)
  console.log('req.body.user ->', req.body.ownerName)
  // req.body.userName = req.user.name;
  // req.body.userAvatar = req.user.avatar;

  // We can push (or unshift) subdocs into Mongoose arrays
  console.log('req.body ->', req.body)
  const campaign = await Campaign.create(req.body);
  // ? user.chars.push(req.body);
  try {
    await campaign.save();
    res.redirect(`/campaigns/${campaign._id}`, { title: campaign.name, campaign });
  } catch (err) {
    console.log(err);
    res.render('campaigns/new', { title: 'New Campaign broke', errorMsg: err.message });
  }
  // Step 5:  Respond to the Request (redirect if data has been changed)
  // res.redirect(`/campaigns`);
  res.redirect(`/campaigns/${campaign._id}`);
}

async function edit(req, res, next) {
  console.log('campaign edit')
  try {
    const campaign = await Campaign.findById(req.params.id);
    res.render('campaigns/edit', { title: `Edit Campaign: ${campaign.name}`, campaign, errorMsg: '' });
  } catch (error) {
    next()
  }
}

async function update(req, res) {
  console.log('campaign update')
  const campaign = await Campaign.findById(req.params.id);
  const usersChars = await Char.find({ campaign: { $exists: false } });
  const campaignChars = await Char.find({ campaign: campaign });
  try {
    const campaignInfo = await Campaign.findById(req.params.id);
    // const body = formatBody(req.body);
    Object.assign(campaignInfo, req.body);
    await campaignInfo.save()
    res.render('campaigns/show', { title: campaignInfo.name, campaign: campaignInfo.toObject(), usersChars, campaignChars })
  } catch (err) {
    res.render('campaign/edit', { title: `Edit Campaign:`, campaign, errorMsg: err.message });
  }
}