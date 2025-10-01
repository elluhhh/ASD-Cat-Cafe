const express = require('express');
const path = require('path');
const multer = require('multer');
const { Cat } = require('../models/Cat');

const router = express.Router();

// ---------- Multer config ----------
const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'public', 'uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ---------- Routes ----------

// Add new cat
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const cat = await Cat.create({
      name: req.body.name,
      breed: req.body.breed,
      ageMonths: req.body.ageMonths ? Number(req.body.ageMonths) : null,
      isAdopted: req.body.isAdopted === 'true',
      imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
    });
    res.status(201).json(cat);  // ✅ JSON always
  } catch (err) {
    res.status(500).json({ message: 'Create failed', error: err.message });
  }
});

// List all cats
router.get('/', async (req, res) => {
  try {
    const cats = await Cat.find();
    res.json(cats);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
});

// Get one cat
router.get('/:id', async (req, res) => {
  try {
    const cat = await Cat.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Cat not found' });
    res.json(cat);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
});

// Update cat
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const update = {
      name: req.body.name,
      breed: req.body.breed,
      ageMonths: req.body.ageMonths ? Number(req.body.ageMonths) : null,
      isAdopted: req.body.isAdopted === 'true',
    };
    if (req.file) update.imageUrl = `/uploads/${req.file.filename}`;

    const cat = await Cat.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!cat) return res.status(404).json({ message: 'Cat not found' });

    res.json(cat);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});

// Delete cat
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