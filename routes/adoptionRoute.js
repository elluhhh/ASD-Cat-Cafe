// Jean Quisumbing
const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { AdoptionRequest } = require('../models/adoptionRequest');
const Cat = require('../models/Cat');

// Short tracking code
const makeCode = () => crypto.randomBytes(6).toString('base64url');

// Landing: redirect to form
router.get('/', (req, res) => res.redirect('/adoption/request'));

// Show the form
router.get('/request', async (req, res, next) => {
  try {
    // Get cat information from cat profile
    const catId = req.query.catId || null;
    const cat = catId ? await Cat.findById(catId) : null;
    res.render('adoptionForm', { catId, cat });
  } catch (err) {
    next(err);
  }
});

// Create request, then go to status page
router.post('/request', async (req, res, next) => {
  try {
    const body = req.body || {};
    const doc = await AdoptionRequest.create({
      trackingCode: makeCode(),
      applicant: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
        livesWithChildren: body.livesWithChildren === 'yes',
        hasOtherPets: body.hasOtherPets === 'yes',
        whyAdopt: body.whyAdopt,
      },
      catId: body.catId || null,
    });
    res.redirect(`/adoption/status/${doc.trackingCode}`);
  } catch (e) { next(e); }
});

// Show status by code
router.get('/status/:code', async (req, res, next) => {
  try {
    const code = req.params.code;
    const doc = await AdoptionRequest.findOne({ trackingCode: code });

    if (!doc) {
      return res.status(404).render('adoptionStatus', {
        lookupOnly: false,
        notFound: true,
        code,
        reqDoc: null
      });
    }

    res.render('adoptionStatus', {
      lookupOnly: false,
      notFound: false,
      reqDoc: {
        trackingCode: doc.trackingCode,
        status: doc.status,
        applicant: doc.applicant || {},
        createdAt: doc.createdAt || new Date(),
        updatedAt: doc.updatedAt || new Date(),
        catId: doc.catId || null
      }
    });
  } catch (e) {
    next(e);
  }
});

// Handle form submission for ?code=
router.get('/status', (req, res) => {
  const code = (req.query.code || '').trim();
  if (!code) return res.redirect('/adoption/check');
  res.redirect(`/adoption/status/${encodeURIComponent(code)}`);
});

// Simple page to enter a tracking code and check status
router.get('/check', (req, res) => {
  res.render('adoptionStatus', {
    lookupOnly: true,  
    notFound: null,
    code: '',
    reqDoc: null
  });
});

module.exports = router;