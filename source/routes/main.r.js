const express = require('express');
const router = express.Router();

const PageController = require('../controllers/main.c');

router.get('/', PageController.home);

module.exports = router