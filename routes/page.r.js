const express = require('express');
const router = express.Router();

const PageController = require('../controllers/page.c');

router.use('/', PageController.home);

module.exports = router