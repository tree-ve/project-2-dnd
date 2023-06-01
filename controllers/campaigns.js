const Char = require('../models/char');
const Campaign = require('../models/campaign');

module.exports = {
  index,
  show,
  new: newCampaign,
  create
};

async function index(req, res) {
  const campaigns = await Campaign.find({});
  res.render('campaigns/index', { title: 'All Campaigns', campaigns });
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
  // convert nowShowing's checkbox of nothing or "on" to boolean
  // req.body.nowShowing = !!req.body.nowShowing;
  // Remove empty properties so that defaults will be applied
  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key];
  }
  try {
    // Update this line because now we need the _id of the new movie
    const campaign = await Campaign.create(req.body);
    // Redirect to the new movie's show functionality 
    res.redirect(`/campains/${campaign._id}`);
  } catch (err) {
    // Typically some sort of validation error
    console.log(err);
    res.render('campaigns/new', { errorMsg: err.message });
  }
}