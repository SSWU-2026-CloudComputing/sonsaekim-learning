const express = require('express');
const router = express.Router();
const { Quiz, SignWord, SignVc } = require('../models');
const contentsController = require('../controllers/contentsController');

router.get('/vc/:id', contentsController.getSignVcById);

router.get('/word/:id', contentsController.getSignWordById);

module.exports = router;
