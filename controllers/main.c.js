const Movie = require('../models/movie.m');

class PageController{
    async home(req, res, next) {
        try {
            const topRatingMovies = await Movie.getTopRating(); 
            //console.log(topRatingMovies);
            const topBoxOffice = await Movie.getTopBoxOffice();
            //console.log(topBoxOffice);
            res.render('homepage', {
                topRatingMovies,
                topBoxOffice
            });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new PageController;