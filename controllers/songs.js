const Song = require('../models/song');
const Campaign = require('../models/campaign');
// const Char = require('../models/char');
const User = require('../models/user');
// ! const Performer = require('../models/performer');

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
            res.render('', { title: 'D&D Organiser', errorMsg: err.message });
        }
        res.render('songs/index', { title: 'My Songs', songs, campaigns, currentUser }); 
    } catch (err) {
        if (req.user === undefined) {
        console.log('user undefined')
        res.render('', { title: 'D&D Organiser', errorMsg: err.message });
        }
    }
}

// async function show(req, res) {
//     console.log('song/show')
//     try {
//         const campaign = await Campaign.findById(req.params.id);
//         const user = await User.findById(req.user._id);
//         const userCharsArr = []
//         for (i = 0; i < req.user.chars.length; i++) {
//             const userChar = await Char.findById(req.user.chars[i]);
//             userCharsArr.push(userChar)
//         }
//         const chars = await Char.find({ _id: userCharsArr });
//         const usersChars = await Char.find({ campaign: { $exists: false } });
//         const campaignChars = await Char.find({ campaign: campaign }).sort('name');
//         res.render('campaigns/show', { title: campaign.name, campaign, chars, usersChars, campaignChars });
//     } catch (err) {
//         console.log('err', err);
//         // console.log(req.user)
//         if (req.user === undefined) {
//             console.log('user undefined')
//             res.render('', { title: 'D&D Organiser', errorMsg: err.message });
//         }
//         console.log('penultimate campaign show err');
//         res.render('campaigns', { title: 'My Campaigns', errorMsg: err.message });
//     }
// }

async function show(req, res) {
    console.log('songs show');
    try {
      const user = await User.findById(req.user._id);
      const song = await Song.findById(req.params.id);
      const activeCampaigns = await Campaign.find({ _id: song.campaigns });
      const campaigns = await Campaign.find({ _id: { $nin: song.campaigns } }).populate('name');
      res.render('songs/show', { title: song.name, song, campaigns, activeCampaigns });
    } catch (err) {
      if (req.user === undefined) {
        console.log('user undefined')
        res.render('', { title: 'D&D Organiser', errorMsg: err.message });
      }
    }
  }

function newSong(req, res) {
    console.log('songs new');
    res.render('songs/new', { title: 'New Song', errorMsg: '' });
}
  
async function create(req, res) {
    console.log('songs create');
    try {
        const user = await User.findById(req.params.id);
        console.log('req.params.id ->', req.params.id)
        console.log('user ->', user)
        req.body.user = req.user._id;
        console.log('req.body.user ->', req.body.user)
        console.log('req.body ->', req.body)
        const song = await Song.create(req.body);
        user.songs.push(song);
        await user.save();
        await song.save();
        // res.render(`/songs/${song._id}`, { title: song.name, song });
        // index(user)
        const songs = await Song.find({ user: req.user._id});
        const currentUser = await User.find({}).populate('songs');
        const campaigns = await Campaign.find({});
        res.render('songs/index', { title: 'My Songs', songs, campaigns, currentUser });
        // res.redirect('songs/index');
    } catch (err) {
        console.log('err', err.message);
        res.render('songs/new', { title: 'New Song', errorMsg: err.message });
    }
}

async function edit(req, res, next) {
    console.log('songs edit')
    try {
        const song = await Song.findById(req.params.id);
        res.render('songs/edit', { title: `Edit Song`, song, errorMsg: '' });
    } catch (err) {
        next()
    }
} 
  
async function update(req, res) {
    console.log('songs update')
    console.log(req.params.id);
    const song = await Song.findById(req.params.id);
    const activeCampaigns = await Campaign.find({ _id: song.campaigns })
    try {
        const songInfo = await Song.findById(req.params.id);
        console.log('song -> ', song);
        console.log('songInfo -> ', songInfo);
        console.log('req.body -> ', req.body);
        // const body = formatBody(req.body);
        Object.assign(song, req.body);
        await song.save()
        console.log('songInfo -> ', songInfo);
        // res.render('chars/show', { title: charInfo.name, char: charInfo.toObject(), activeCampaign })
        res.render('songs/show', { title: song.name, song, activeCampaigns })
    } catch (err) {
        res.render('songs/edit', { title: `Edit Song`, song, errorMsg: err.message });
    }
}

async function deleteSong(req, res) {
    console.log('songs delete');
    const user = await User.findById(req.user._id)
    const song = await Song.findById(req.params.id);
    if (!song) {
      console.log('not valid user?');
      return res.redirect('/songs')
    };
    user.songs.remove(song._id)
    await user.save()
    console.log(user.songs)
    song.deleteOne(
      { _id: req.params.id }
    )
    res.redirect('/songs');
}

async function addToCampaign(req, res, next) {
    console.log('songs addToCampaign')
    const campaign = await Campaign.findById(req.params.id);
    const song = await Song.findById(req.body.songId);
    // ? campaign.chars.push(req.body.chars);
    try {
        // song.campaign = {}
        song.campaigns.push(campaign)
        await song.save();
        res.redirect(`/campaigns/${campaign._id}`);
    } catch (err) {
        res.redirect(`/campaigns/${campaign._id}`);
        next()
    }
}
  
async function removeFromCampaign(req, res) {
    console.log('songs removeFromCampaign')
    const campaign = await Campaign.findById(req.params.id);
    const song = await Song.findById(req.body.songId);
    // for (const key in song.campaigns) {
    //     char.campaign = undefined;
    // }
    for (i = 0; i < song.campaigns.length; i++) {
        // const userChar = await Char.findById(req.user.chars[i]);
        console.log('campaign', campaign)
        if (song.campaigns[i] === campaign._id) {
            console.log('MATCH', 'song.campaigns[i]', song.campaigns[i], 'campaign', campaign)
        } else {
            console.log('song.campaigns[i]', song.campaigns[i])
        }
        // userCharsArr.push(userChar)
    }
    await song.save();
    await campaign.save();
    res.redirect(`/campaigns/${campaign._id}`);
}