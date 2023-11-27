const Movie = require('../models/movie.m');

class PageController{
    async home(req, res, next) {
        try {
            const topRatingMovies = await Movie.getTopRating(); 
            //console.log(topRatingMovies);
            const topBoxOffice = await Movie.getTopBoxOffice();
            //console.log(topBoxOffice);
            const topFavoriteMovies = await Movie.getFavoriteMovies();
            //console.log(topFavoriteMovies);
            res.render('homepage', {
                topRatingMovies,
                topBoxOffice,
                topFavoriteMovies
            });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new PageController;