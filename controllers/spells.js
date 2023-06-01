const Spell = require('../models/spell');
// ! const Performer = require('../models/performer');

module.exports = {
    index,
    show,
};

async function index(req, res) {
    const spells = await Spell.find({});
    res.render('spells/index', { title: 'All Spells', spells });
}

async function show(req, res) {
    // Populate the cast array with performer docs instead of ObjectIds
    const spell = await Spell.findById(req.params.id).populate('cast');
    // Mongoose query builder approach to retrieve performers not the spell:
        // Performer.find({}).where('_id').nin(spell.cast)
    // The native MongoDB approach uses a query object to find 
    // performer docs whose _ids are not in the spell.cast array like this:
    // ! const performers = await Performer.find({ _id: { $nin: spell.cast } }).sort('name');
    // ! res.render('spells/show', { title: 'Spell Detail', spell, performers });
    res.render('spells/show', { title: spell.name, spell });
}