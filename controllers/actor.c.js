const Actor = require('../models/actor.m');

class ActorController{
    async getActorDetail(req, res, next){
        try {
            const {actorId} = req.params;
            const {perPage = 6, page = 1} = req.query;
            const actor = await Actor.getDetail(actorId);
            //console.log(actor);
            const movieList = await Actor.getRelatedMovies(actorId);
            const totalPage = Math.ceil(movieList.length / perPage);
            res.render('actorDetail', {
                actor,
                movieList: movieList.splice((page - 1) * perPage, perPage),
                page,
                totalPage,
            })
        } catch (error) {
            next(error);
        }
    }
    async searchActor(req, res, next){
        try {
            const {searchKey, perPage=9, page=1} = req.query;
            //console.log(searchKey);
            const actorList = await Actor.searchActor(searchKey);
            //console.log(actorList);

            const totalPage = Math.ceil(actorList.length / perPage);
            res.render('actorSearchResult', {
                actorList: actorList.splice((page - 1) * perPage, perPage),
                page,
                searchKey,
                totalPage,
            })
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ActorController;