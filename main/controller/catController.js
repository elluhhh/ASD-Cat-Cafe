const { Cat } = require('../model/Cat'); 

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
exports.get = async (req, res, next) => {
  try {
    const cat = await Cat.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: "Not found" });
    res.json(cat);
  } catch (err) {
    next(err);
  }
};

/*POST Creates a new cat record. Validates information on name, ageMonths (must be ≥ 0), price (must be ≥ 0)
*/
exports.create = async (req, res, next) => {
  try {
    const cat = await Cat.create(req.body);
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