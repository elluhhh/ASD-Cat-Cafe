// Jean Quisumbing
const express = require('express');
const path = require('path');
const multer = require('multer');

const CatModel = require('../models/Cat');
const Cat = CatModel?.Cat || CatModel;

const router = express.Router();

// Multer setup for image uploads 
const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'public', 'uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// LIST ALL 
router.get('/', async (_req, res) => {
  try {
    const cats = await Cat.find();
    res.json(cats);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
});

// GET CAT 
router.get('/:id', async (req, res) => {
  try {
    const cat = await Cat.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Cat not found' });
    res.json(cat);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
});

// ADD NEW CAT
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const cat = await Cat.create({
      name: req.body.name?.trim(),
      breed: req.body.breed?.trim(),
      gender: req.body.gender || null, 
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

// UPDATE CAT 
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const isAdoptedValue =
      req.body.isAdopted === 'true' || req.body.isAdopted === true;

    // Base update fields
    const update = {
      name: req.body.name?.trim(),
      breed: req.body.breed?.trim(),
      gender: req.body.gender || null, 
      ageMonths: req.body.ageMonths ? Number(req.body.ageMonths) : null,
      microchipId: req.body.microchipId?.trim(),
      price: req.body.price ? Number(req.body.price) : 0,
      description: req.body.description?.trim(),
      isAdopted: isAdoptedValue,
    };

    // If a new file is uploaded, replace image
    if (req.file) {
      update.imageUrl = `/uploads/${req.file.filename}`;
    } else {
      // Keep the old image if no new one is uploaded
      const existing = await Cat.findById(req.params.id).select('imageUrl');
      if (existing?.imageUrl) update.imageUrl = existing.imageUrl;
    }

    const cat = await Cat.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!cat) return res.status(404).json({ message: 'Cat not found' });
    res.json(cat);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: 'Update failed', error: err.message });
  }
});

// DELETE CAT 
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