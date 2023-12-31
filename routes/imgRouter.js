const Router = require('express');
const router = new Router();
const imgController = require('../controllers/imgController');
// const checkRole = require('../middleware/checkRoleMiddleware');
// const authMiddleware = require('../middleware/authMiddleware');

// router.post('/', authMiddleware, checkRole('ADMIN'), galleryController.create);
// router.get('/all', galleryController.getAll);
// router.get(
//   '/drop',
//   authMiddleware,
//   // checkRole('ADMIN'),
//   imgController.dropTable,
// );
// router.delete(
//   '/:id',
//   authMiddleware,
//   // checkRole('ADMIN'),
//   galleryController.deleteOne,
// );
// router.get('/:id', galleryController.getOne);

router.post('/single-img-conversion', imgController.singleImgConversion);
router.post('/multiple-img-conversion', imgController.multipleImgConversion);
router.get('/local-conversion', imgController.localConversion);
module.exports = router;
