require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- routes that don't need DB (safe in tests)
app.get('/catprofile', (req, res, next) => {
  try {
    res.render('catProfile');
  } catch (e) {
    next(e);
  }
});

// If you have API routes that need DB, keep the `use` here but they will only work when start() runs
// app.use('/api/cats', require('./route/catRoute'));

async function start() {
  let uri = process.env.MONGODB_URI;

  if (!uri) {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mem = await MongoMemoryServer.create();
    uri = mem.getUri();
    if (process.env.NODE_ENV !== 'test') {
      console.log('Using in-memory MongoDB:', uri);
    }
  }

  await mongoose.connect(uri);
  if (process.env.NODE_ENV !== 'test') {
    console.log('Mongo connected');
  }

  // Now that DB is ready, mount routes that need it (optional):
  // app.use('/api/cats', require('./route/catRoute'));
}

const PORT = process.env.PORT || 4000;

// ✅ Only start DB & server when NOT testing
if (process.env.NODE_ENV !== 'test') {
  start()
    .then(() => {
      app.listen(PORT, () => console.log(`API http://localhost:${PORT}`));
    })
    .catch((e) => {
      console.error('Startup error:', e);
      process.exit(1);
    });
}

// ✅ Export app for supertest in Jest
module.exports = app;