const Cat = require('../models/catModel.js');

// Get cats for display
const getCats = async (req, res) => {
    try {
        const cats = await Cat.find();
        res.render('cat-display', { cats });
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = { getCats };