const { Cat } = require('../models/Cat'); 

exports.list = async (req, res, next) => {
  try {
    const cats = await Cat.find();
    res.json(cats);
  } catch (err) {
    next(err);
  }
};

/* GET
Query params:
 *   - q: text search (name/breed)
 *   - adopted: "true" | "false"  
 *   - page: number (default 1)
 *   - limit: number (default 10, max 100) 
 * Retrieves a single cat by its ID. Returns a 404 if not found.*/
exports.getCat = async (req, res, next) => {
  try {
    const cat = await Cat.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: "Not found" });
    res.json(cat);
  } catch (err) {
    next(err);
  }
    const cat = await Cat.findById(req.params.id).lean();
    if (!cat) return res.status(404).json({ message: 'Cat not found' });

    res.render('cat-profile', { cat });
  } catch (err) { next(err); }
};

// Get all cats
exports.getAllCats = async (req, res, next) => {
  try {
    const cats = await Cat.find().lean();
    res.render('cat-display', { cats }); // send cats to cat display page
  } catch (err) {
    next(err);
  }
}

/*POST Creates a new cat record. Validates information on name, ageMonths (must be ≥ 0), price (must be ≥ 0)
*/
exports.create = async (req, res, next) => {
  try {
    if (!req.body.name) return res.status(400).json({ message: 'name is required' });
    if (req.body.ageMonths != null && req.body.ageMonths < 0) {
      return res.status(400).json({ message: 'ageMonths must be >= 0' });
    }
    if (req.body.price != null && req.body.price < 0) {
      return res.status(400).json({ message: 'price must be >= 0' });
    }

    const cat = await Cat.create(req.body);
    res.status(201).json(cat);
  } catch (err) {
    next(err);
  }
};

exports.createCat = async (req, res, next) => {
  try {
    const { name, gender, dob, breed, price, microchipId, colour, description, ageMonths } = req.body;

    if (!req.body.name) return res.status(400).json({ message: 'name is required' });
    if (req.body.ageMonths != null && req.body.ageMonths < 0) {
      return res.status(400).json({ message: 'ageMonths must be >= 0' });
    }
    if (req.body.price != null && req.body.price < 0) {
      return res.status(400).json({ message: 'price must be >= 0' });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = '/public/uploads/${req.file.filename}';
    }

    const cat = await Cat.create({
      name,
      gender,
      dob,
      breed,
      price,
      microchipId,
      colour,
      description,
      imageUrl,
      ageMonths
    });

    res.status(201).json(cat);
  } catch (err) {
    next(err);
  }
};

// PUT. Replaces a cat by ID with the new data. Adds an updatedAt timestamp.
/*exports.update = async (req, res, next) => {
  try {
    const cat = await Cat.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!cat) return res.status(404).json({ message: 'Cat not found' });
    res.json(cat);
  } catch (err) { next(err); }
};*/
// PUT /cats/:id
exports.update = async (req, res, next) => {
  try {
    const cat = await Cat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!cat) return res.status(404).json({ message: "Not found" });
    res.json(cat);
  } catch (err) {
    next(err);
  }
};

// PATCH - NOT USING THIS. SAME AS PUT............
exports.patch = exports.update;

// DELETE. Deletes a cat by ID. Returns 204 No Content if successful.
exports.remove = async (req, res, next) => {
  try {
    const cat = await Cat.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};