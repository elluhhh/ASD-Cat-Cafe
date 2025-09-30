const express = require('express');
const { getAllRequests, getRequestById } = require('../controllers/requestController.js');
const router = express.Router();

router.get('/', getAllRequests);
router.get('/:id', getRequestById);

module.exports = router;