const Movie = require('../models/movie.m');
const Review = require('../models/review.m')

class MovieController{
    async detailMovie(req, res, next) {
        try {
            const {movieId} = req.params;
            //console.log(movieId);
            const movie = await Movie.getDetail(movieId);
            //console.log(movie);
            const actors = await Movie.getActorList(movieId);
            //console.log(actors);
            const reviews = await Review.getReview(movieId);
            res.render('movieDetail', {movie, actors, review: reviews});
        } catch (error) {
            next(error);
        }
    }
    async searchMovie(req, res, next){
        try {
            const {searchKey, perPage=9, page=1} = req.query;
            //console.log(searchKey);
            const movieList = await Movie.searchByTitle(searchKey);
            //console.log(movieList);

            const totalPage = Math.ceil(movieList.length / perPage);
            res.render('movieSearchResult', {
                movieList: movieList.splice((page - 1) * perPage, perPage),
                page,
                searchKey,
                totalPage,
            })
        } catch (error) {
            next(error);
        }
    }
    async getReview(req, res, next){
        try {
            const {movieId} = req.params;
            let {perPage = 2, page = 1} = req.query;
            page = Number.parseInt(page);
            perPage = Number.parseInt(perPage);

            const reviews = await Review.getReview(movieId);
            const totalPage = Math.ceil(reviews.length / perPage);
            res.json({
                data: reviews.splice((page - 1) * perPage, perPage),
                totalPage,
                page,
                perPage
            })
        } catch (error) {
            next(error);
        }
    }
    async addFavoriteMovie(req, res, next) {
        try {
          const { movieId } = req.body;
          const isAdded = await Movie.addFavoriteMovies(movieId);
          if (isAdded) {
            res.status(200).send('200');
          } else {
            res.status(500).send('500');
          }
        } catch (error) {
          next(error);
        }
    }
    async deleteFavoriteMovie(req, res, next) {
        try {
          const { movieId } = req.body;
          const isRemoved = await Movie.deleteFavoriteMovie(movieId);
          if (isRemoved) {
            res.status(200).send('200');
          } else {
            res.status(500).send('500');
          }
        } catch (error) {
          next(error);
        }
    }
    async favoriteMovie(req, res, next){
        try {
            let {perPage = 6, page = 1} = req.query;
            page = Number.parseInt(page);
            perPage = Number.parseInt(perPage);

            const movies = await Movie.getFavoriteMovies();
            console.log(movies);
            const totalPage = Math.ceil(movies.length / perPage);
            res.render('favoriteMovie',{
                movieList: movies.splice((page - 1) * perPage, perPage),
                totalPage,
                page,
                perPage
            })
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new MovieController;