const router = require('express').Router();
const ctl = require('../controllers/catController'); 

router.get('/', ctl.list);
router.get('/:id', ctl.get);
router.post('/', ctl.create);
router.put('/:id', ctl.update);
router.patch('/:id', ctl.patch);
router.delete('/:id', ctl.remove);

module.exports = router;
console.log('Controller loaded:', ctl);