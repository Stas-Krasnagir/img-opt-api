const Router = require('express');
const router = new Router();
const imgRouter = require('./imgRouter.js');

router.use('/img', imgRouter);

module.exports = router;
