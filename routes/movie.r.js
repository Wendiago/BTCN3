const express = require('express');
const router = express.Router();

const MovieController = require('../controllers/movie.c');

router.get('/search', MovieController.searchMovie);
router.get("/favoriteMovie", MovieController.favoriteMovie);
router.post("/favoriteMovie/:movieId", MovieController.addFavoriteMovie);
router.delete("/favoriteMovie/:movieId", MovieController.deleteFavoriteMovie);
router.get('/:movieId/reviews', MovieController.getReview);
router.get('/:movieId', MovieController.detailMovie);

module.exports = router