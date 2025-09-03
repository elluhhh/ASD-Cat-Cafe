const { Cat } = require('../model/Cat'); 

exports.list = async (req, res, next) => {
  try {
    const { q, adopted } = req.query;
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (q) filter.$text = { $search: q };
    if (adopted === 'true') filter.isAdopted = true;
    if (adopted === 'false') filter.isAdopted = false;

    const [items, total] = await Promise.all([
      Cat.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Cat.countDocuments(filter),
    ]);

    res.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

/* GET
Query params:
 *   - q: text search (name/breed)
 *   - adopted: "true" | "false"  (maps to isAdopted)
 *   - page: number (default 1)
 *   - limit: number (default 10, max 100) */
exports.get = async (req, res, next) => {
  try {
    const cat = await Cat.findById(req.params.id).lean();
    if (!cat) return res.status(404).json({ message: 'Cat not found' });
    res.json(cat);
  } catch (err) { next(err); }
};

// POST 
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
  } catch (err) { next(err); }
};

// PUT 
exports.update = async (req, res, next) => {
  try {
    const cat = await Cat.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!cat) return res.status(404).json({ message: 'Cat not found' });
    res.json(cat);
  } catch (err) { next(err); }
};

// PATCH 
exports.patch = async (req, res, next) => {
  try {
    const cat = await Cat.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!cat) return res.status(404).json({ message: 'Cat not found' });
    res.json(cat);
  } catch (err) { next(err); }
};

// DELETE
exports.remove = async (req, res, next) => {
  try {
    const deleted = await Cat.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Cat not found' });
    res.status(204).end();
  } catch (err) { next(err); }
};