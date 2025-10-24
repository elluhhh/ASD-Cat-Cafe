// Sarah White

const express = require('express');
const Cat = require('../models/Cat.js');
const router = express.Router();

router.get('/:id', async (req, res) => {
    const cat = await Cat.findById(req.params.id);
    res.render('cat-profile', { cat });
});

router.get('/', async (req, res) => {
    const { name, age, gender } = req.query;
    let filter = {};
    // case insensitive, name allows partial matches
    if (gender) filter.gender = new RegExp(`^${gender}$`, 'i');
    if (name) filter.name = new RegExp(name, 'i');
    if (age) {
        switch (age) {
            case 'kitten':
                filter.ageMonths = { $lte: 12 }; // <=1yr
                break;
            case 'junior':
                filter.ageMonths = { $gte: 13, $lte: 36 }; // >1yr <=3yrs
                break;
            case 'adult':
                filter.ageMonths = { $gte: 37, $lte: 95 }; // >3yrs <8yrs
                break;
            case 'senior':
                filter.ageMonths = { $gte: 96 }; // >=8yrs
                break;
        }
    }

    const cats = await Cat.find(filter).sort({ name: 1 });
    res.render('cat-display', { cats });
});

module.exports = router;