const db = require('../config/connection')

class Actor{
    async getDetail(actor_id){
        const res = await db.query(`
            SELECT * 
            FROM public."Actor" A
            WHERE A.actor_id = $1
        `, [actor_id])
        return res.rows[0];
    }
    async getRelatedMovies(actor_id){
        const res = await db.query(`
            SELECT * 
            FROM public."Actor" A
            WHERE A.actor_id = $1
        `, [actor_id])

        const actor = res.rows[0];
        if (actor){
            const movieIds = actor.castMovies.map(movie => movie.id);

            // Fetch movies that exist in the Movie table
            const existingMoviesQuery = `
                SELECT * FROM public."Movie"
                WHERE movie_id IN (${movieIds.map(id => `'${id}'`).join(',')});
            `;
            const existingMovies = await db.query(existingMoviesQuery);

            return existingMovies.rows;
        } 
    }
}

module.exports = new Actor;