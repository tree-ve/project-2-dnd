const Song = require('../models/song');
const Campaign = require('../models/campaign');
const User = require('../models/user');

module.exports = {
    index,
    show,
    new: newSong,
    create,
    edit,
    update,
    delete: deleteSong,
    addToCampaign,
    removeFromCampaign
  };


async function index(req, res) {
    console.log('songs index');
    try {
        const songs = await Song.find({ user: req.user._id});
        const currentUser = await User.find({}).populate('songs');
        const campaigns = await Campaign.find({});
        if (req.user === undefined) {
            console.log('user undefined')
            return res.render('', { title: 'D&D Organiser', errorMsg: err.message });
        }
        return res.render('songs/index', { title: 'My Songs', songs, campaigns, currentUser }); 
    } catch (err) {
        if (req.user === undefined) {
        console.log('user undefined')
        return res.render('', { title: 'D&D Organiser', errorMsg: err.message });
        }
    }
}

async function show(req, res) {
    console.log('songs show');
    try {
      const user = await User.findById(req.user._id);
      const song = await Song.findById(req.params.id);
      const activeCampaigns = await Campaign.find({ _id: song.campaigns });
      const campaigns = await Campaign.find({ _id: { $nin: song.campaigns } }).populate('name');
      return res.render('songs/show', { title: song.name, song, campaigns, activeCampaigns });
    } catch (err) {
      if (req.user === undefined) {
        console.log('user undefined')
        return res.render('', { title: 'D&D Organiser', errorMsg: err.message });
      }
    }
  }

function newSong(req, res) {
    console.log('songs new');
    return res.render('songs/new', { title: 'New Song', errorMsg: '' });
}
  
async function create(req, res) {
    console.log('songs create');
    try {
        const user = await User.findById(req.params.id);
        // console.log('req.params.id ->', req.params.id)
        // console.log('user ->', user)
        req.body.user = req.user._id;
        // console.log('req.body.user ->', req.body.user)
        // console.log('req.body ->', req.body)
        const song = await Song.create(req.body);
        user.songs.push(song);
        await user.save();
        await song.save();
        // return res.render(`/songs/${song._id}`, { title: song.name, song });
        // index(user)
        const songs = await Song.find({ user: req.user._id});
        const currentUser = await User.find({}).populate('songs');
        const campaigns = await Campaign.find({});
        return res.render('songs/index', { title: 'My Songs', songs, campaigns, currentUser });
        // return res.redirect('songs/index');
    } catch (err) {
        console.log('err', err.message);
        return res.render('songs/new', { title: 'New Song', errorMsg: err.message });
    }
}

async function edit(req, res, next) {
    console.log('songs edit')
    try {
        const song = await Song.findById(req.params.id);
        return res.render('songs/edit', { title: `Edit Song`, song, errorMsg: '' });
    } catch (err) {
        next()
    }
} 
  
async function update(req, res) {
    console.log('songs update')
    // console.log(req.params.id);
    const song = await Song.findById(req.params.id);
    const activeCampaigns = await Campaign.find({ _id: song.campaigns })
    try {
        const songInfo = await Song.findById(req.params.id);
        // console.log('song -> ', song);
        // console.log('songInfo -> ', songInfo);
        // console.log('req.body -> ', req.body);
        // const body = formatBody(req.body);
        Object.assign(song, req.body);
        await song.save()
        // console.log('songInfo -> ', songInfo);
        // return res.render('chars/show', { title: charInfo.name, char: charInfo.toObject(), activeCampaign })
        return res.render('songs/show', { title: song.name, song, activeCampaigns })
    } catch (err) {
        return res.render('songs/edit', { title: `Edit Song`, song, errorMsg: err.message });
    }
}

async function deleteSong(req, res) {
    console.log('songs delete');
    const user = await User.findById(req.user._id)
    const song = await Song.findById(req.params.id);
    if (!song) {
    //   console.log('not valid user?');
      return res.redirect('/songs')
    };
    user.songs.remove(song._id)
    await user.save()
    // console.log(user.songs)
    song.deleteOne(
      { _id: req.params.id }
    )
    return res.redirect('/songs');
}

async function addToCampaign(req, res, next) {
    console.log('songs addToCampaign')
    const campaign = await Campaign.findById(req.params.id);
    const song = await Song.findById(req.body.songId);
    // ? campaign.chars.push(req.body.chars);
    // console.log(song)
    // console.log(campaign)
    try {
        song.campaigns.push(campaign)
        await song.save();
        // console.log(song.campaigns)
        return res.redirect(`/campaigns/${campaign._id}`);
    } catch (err) {
        return res.redirect(`/campaigns/${campaign._id}`);
        next()
    }
}
  
async function removeFromCampaign(req, res) {
    console.log('songs removeFromCampaign')
    const campaign = await Campaign.findById(req.params.id);
    const song = await Song.findById(req.body.songId);
    // console.log(song.campaigns.indexOf(campaign._id))
    const campaignIndex = song.campaigns.indexOf(campaign._id);
    if (campaignIndex > -1) {
        song.campaigns.splice(campaignIndex, 1)
    }
    await song.save();
    await campaign.save();
    // console.log(song.campaigns.indexOf(campaign._id))
    return res.redirect(`/campaigns/${campaign._id}`);
}