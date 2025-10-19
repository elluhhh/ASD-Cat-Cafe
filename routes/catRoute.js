const express = require('express');
const path = require('path');
const multer = require('multer');
const { Cat } = require('../models/Cat');

const router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'public', 'uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// --- CREATE 
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const cat = await Cat.create({
      name: req.body.name,
      breed: req.body.breed,
      ageMonths: req.body.ageMonths ? Number(req.body.ageMonths) : null,
      isAdopted: req.body.isAdopted === 'true',
      microchipId: (req.body.microchipId || '').trim(),
      price: req.body.price !== undefined && req.body.price !== ''
        ? Number(req.body.price)
        : 0,
      description: (req.body.description || '').trim(),

      imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
    });
    res.status(201).json(cat);
  } catch (err) {
    res.status(500).json({ message: 'Create failed', error: err.message });
  }
});

// --- UPDATE (with optional new image)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const update = {
      name: req.body.name,
      breed: req.body.breed,
      ageMonths: req.body.ageMonths ? Number(req.body.ageMonths) : null,
      isAdopted: req.body.isAdopted === 'true',
      microchipId: (req.body.microchipId || '').trim(),
      price: req.body.price !== undefined && req.body.price !== ''
        ? Number(req.body.price)
        : 0,
      description: (req.body.description || '').trim(),
    };
    if (req.file) update.imageUrl = `/uploads/${req.file.filename}`;

    const cat = await Cat.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!cat) return res.status(404).json({ message: 'Cat not found' });
    res.json(cat);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});