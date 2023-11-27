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
    async searchActor(input){
        if (!input || input.length === 0) {
            const res = await db.query(`
                SELECT * FROM public."Actor"
            `);
            return res.rows;
        }
        const res = await db.query(`
            SELECT * FROM public."Actor" A
            WHERE UPPER(A.name) LIKE UPPER('%' || $1 || '%')
        `, [input])
        return res.rows;
    }
    async getRelatedMovies(actor_id) {
        const res = await db.query(`
            SELECT * 
            FROM public."Actor" A
            WHERE A.actor_id = $1
        `, [actor_id]);
    
        const actor = res.rows[0];
    
        if (actor && actor.castMovies && Array.isArray(actor.castMovies)) {
            const movieIds = actor.castMovies.map(movie => movie.id);
            //console.log(actor);
            // Fetch movies that exist in the Movie table
            const existingMoviesQuery = `
                SELECT * FROM public."Movie"
                WHERE movie_id IN (${movieIds.map(id => `'${id}'`).join(',')});
            `;
            //console.log(movieIds.map(id => `'${id}'`).join(','))
            const existingMovies = await db.query(existingMoviesQuery);
            return existingMovies.rows;
        }
        else{
            return [];
        }
    }    
}

module.exports = new Actor;