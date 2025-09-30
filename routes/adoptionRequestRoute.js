const express = require('express');
const { getAllRequests, getRequestById, updateRequest } = require('../controllers/requestController.js');
const router = express.Router();

router.get('/', getAllRequests);
router.get('/:id', getRequestById);
router.post('/update', updateRequest);

module.exports = router;