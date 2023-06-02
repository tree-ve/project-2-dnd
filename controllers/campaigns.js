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
};

async function index(req, res) {
  const campaigns = await Campaign.find({});
  res.render('campaigns/index', { title: 'All Campaigns', campaigns });
}

// async function addToCampaign(req, res) {
//   // const movie = await Movie.findById(req.params.id);
//   console.log('req.params.id ->', req.params.id)
//   console.log('user ->', user)
//   console.log('req.body.user ->', req.body.user)
//   // The cast array holds the performer's ObjectId (referencing)
//   // movie.cast.push(req.body.performerId);
//   // await movie.save();
//   // res.redirect(`/movies/${movie._id}`);
// }

async function deleteCampaign(req, res) {
  console.log('delete');
  // console.log('req.params.id ->', req.params.id)
  // console.log('req.user._id ->', req.user._id)
  // const char = await Char.findOne({ _id: req.params.id, 'chars.user': req.user._id});
  // const char = await Char.findOne({ _id: req.params.id })
  // const user = await User.findOne({ 'user._id': req.params.id, 'chars.owner': req.user._id});
  const campaign = await Campaign.findById(req.params.id);
  // console.log(req.user._id, campaign.owner);
  if (!campaign) {
    console.log('not valid campaign?');
    return res.redirect('/campaigns')
  };
  // char.remove(req.params.id)
  campaign.deleteOne(
    { _id: req.params.id }
  )
  // await user.save();
  res.redirect('/campaigns');
}

async function show(req, res) {
  // Populate the cast array with performer docs instead of ObjectIds
  const campaign = await Campaign.findById(req.params.id);
  // Mongoose query builder approach to retrieve performers not the movie:
    // Performer.find({}).where('_id').nin(movie.cast)
  // The native MongoDB approach uses a query object to find 
  // performer docs whose _ids are not in the movie.cast array like this:
  const chars = await Char.find({ _id: { $nin: campaign.chars } }).sort('name');
  res.render('campaigns/show', { title: 'Campaign Details', campaign, chars });
}

function newCampaign(req, res) {
  // We'll want to be able to render an  
  // errorMsg if the create action fails
  res.render('campaigns/new', { title: 'New Campaign', errorMsg: '' });
}

async function create(req, res) {
  console.log('create');
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
  console.log('edit')
  try {
    const campaign = await Campaign.findById(req.params.id);
    res.render('campaigns/edit', { title: `Edit Campaign: ${campaign.name}`, campaign, errorMsg: '' });
  } catch (error) {
    next()
  }
}

async function update(req, res) {
  console.log('update')
  const campaign = await Campaign.findById(req.params.id);
  try {
    const campaignInfo = await Campaign.findById(req.params.id);
    // const body = formatBody(req.body);
    Object.assign(campaignInfo, req.body);
    await campaignInfo.save()
    res.render('campaigns/show', { title: campaignInfo.name, campaign: campaignInfo.toObject() })
  } catch (err) {
    res.render('campaign/edit', { title: `Edit Campaign: ${campaign.name}`, campaign, errorMsg: err.message });
  }
}