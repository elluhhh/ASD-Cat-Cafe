const express = require('express');
const { getCat, getAllCats, createCat } = require('../controllers/catController.js');
const multer = require('multer');
const path = require('path');
const Cat = require('../models/Cat.js');
const router = express.Router();

// save uploaded file to folder
const storage = multer.diskStorage({
    destination: 'public/uploads',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post('/add', upload.single('image'), createCat);
router.get('/:id', getCat);

router.get('/', async (req, res) => {
    const { gender } = req.query;
    // match any case for gender field
    const filter = gender ? { gender: new RegExp(`^${gender}$`, 'i') } : {};
    const cats = await Cat.find(filter);
    res.render('cat-display', { cats });
});

module.exports = router;