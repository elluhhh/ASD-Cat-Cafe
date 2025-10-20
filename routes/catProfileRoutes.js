const express = require('express');
const path = require('path');
const multer = require('multer');

const CatModel = require('../models/Cat');
const Cat = CatModel?.Cat || CatModel;

const router = express.Router();

// --- Multer setup for image uploads ---
const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'public', 'uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ---------- 1. LIST ALL ----------
router.get('/', async (_req, res) => {
  try {
    const cats = await Cat.find();
    res.json(cats);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
});

// ---------- 2. GET ONE ----------
router.get('/:id', async (req, res) => {
  try {
    const cat = await Cat.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Cat not found' });
    res.json(cat);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
});

// ---------- 3. ADD ----------
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const cat = await Cat.create({
      name: req.body.name?.trim(),
      breed: req.body.breed?.trim(),
      ageMonths: req.body.ageMonths ? Number(req.body.ageMonths) : null,
      microchipId: req.body.microchipId?.trim(),
      price: req.body.price ? Number(req.body.price) : 0,
      description: req.body.description?.trim(),
      isAdopted: req.body.isAdopted === 'true',
      imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
    });
    res.status(201).json(cat);
  } catch (err) {
    res.status(500).json({ message: 'Create failed', error: err.message });
  }
});

// ---------- 4. UPDATE ----------
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const isAdoptedValue = req.body.isAdopted === 'true' || req.body.isAdopted === true;

    const update = {
      name: req.body.name?.trim(),
      breed: req.body.breed?.trim(),
      ageMonths: req.body.ageMonths ? Number(req.body.ageMonths) : null,
      microchipId: req.body.microchipId?.trim(),
      price: req.body.price ? Number(req.body.price) : 0,
      description: req.body.description?.trim(),
      isAdopted: isAdoptedValue, 
    };

    if (req.file) update.imageUrl = `/uploads/${req.file.filename}`;

    const cat = await Cat.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!cat) return res.status(404).json({ message: 'Cat not found' });
    res.json(cat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});

// ---------- 5. DELETE ----------
router.delete('/:id', async (req, res) => {
  try {
    const cat = await Cat.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Cat not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
});

module.exports = router;