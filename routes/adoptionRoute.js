const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { AdoptionRequest } = require('../main/model/AdoptionRequest');

// Short tracking code
const makeCode = () => crypto.randomBytes(6).toString('base64url');

// Landing: redirect to form
router.get('/', (req, res) => res.redirect('/adoption/request'));

// Show the form
router.get('/request', (req, res) => {
  res.render('adoptionForm');
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

router.get('/status/:code', async (req, res, next) => {
  try {
    const doc = await AdoptionRequest.findOne({ trackingCode: req.params.code }).lean();
    if (!doc) return res.status(404).render('adoptionStatus', { notFound: true, code: req.params.code });
    res.render('adoptionStatus', { notFound: false, reqDoc: doc });
  } catch (e) { next(e); }
});


router.get('/status', (req, res) => {
  const code = (req.query.code || '').trim();
  if (!code) return res.redirect('/adoption/request');
  res.redirect(`/adoption/status/${encodeURIComponent(code)}`);
});

module.exports = router;