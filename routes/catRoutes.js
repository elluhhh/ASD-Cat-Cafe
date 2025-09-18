const express = require('express');
const { getCats } = require('../controllers/catController.js');

const multer = require('multer');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('cat-display');
// save uploaded file to folder
const storage = multer.diskStorage({
    destination: 'public/uploads',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

router.get('/', getCats);
const upload = multer({ storage });

router.post('/add', upload.single('image'), createCat);
router.get('/', getAllCats);
router.get('/:id', getCat)

module.exports = router;