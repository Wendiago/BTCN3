class FavController{
    async home(req, res, next) {
        try {
            res.render('homepage');
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new FavController;