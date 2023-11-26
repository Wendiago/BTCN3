const express = require('express');
const router = express.Router();

const MovieController = require('../controllers/movie.c');

router.get('/search', MovieController.searchMovie);
router.get('/:movieId', MovieController.detailMovie);
router.get('/:movieId/reviews', MovieController.getReview);

module.exports = router