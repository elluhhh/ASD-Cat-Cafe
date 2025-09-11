const express = require('express');
const { getCats } = require('../controllers/catController.js');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('cat-display');
});

router.get('/', getCats);

module.exports = router;