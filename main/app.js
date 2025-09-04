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

app.get('/catprofile', (req, res, next) => {
  try {
    res.render('catProfile');
  } catch (e) {
    next(e);
  }
});

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
}

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'test') {
  start()
    .then(() => {
      app.listen(PORT, () => console.log(`API http://localhost:${PORT}/catprofile`));
    })
    .catch((e) => {
      console.error('Startup error:', e);
      process.exit(1);
    });
}

module.exports = app;