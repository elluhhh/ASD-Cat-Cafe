require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/cats', async (req, res, next) => {
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
    console.log('Using in-memory MongoDB:', uri);
  }

  await mongoose.connect(uri);
  console.log('Mongo connected');

  // routes
  //app.use('/api/cats', require('./route/catRoute'));

  app.use((err, req, res, next) => {
    console.error(err);
    if (err.name === 'ValidationError' || err.code === 11000) {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`API http://localhost:${PORT}`));
}

start().catch((e) => {
  console.error('Startup error:', e);
  process.exit(1);
});