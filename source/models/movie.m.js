const db = require('../config/connection')

class Movie{
    async getTopRating() {
        const res = await db.query(`
            SELECT * FROM public."Movie" m WHERE m."imDbRating" IS NOT NULL 
            ORDER BY m."imDbRating" DESC
            LIMIT 5
        `);
    
        return res.rows;
    }
    async getTopBoxOffice(){
        const res = await db.query(`
            SELECT *
            FROM public."Movie"
            WHERE "boxOffice" ~ '^[0-9$,.]+$'  -- Filter out rows with non-numeric or empty strings
            ORDER BY CASE 
                WHEN "boxOffice" ~ '^\$' THEN REPLACE(REPLACE("boxOffice", '$', ''), ',', '')::numeric
                ELSE 0  -- Assign a default value (here, 0) for non-matching rows
            END DESC
            LIMIT 15;
        `)
        return res.rows;
    }
    async getTopFavorites(){
        const res = await db.query(`
            SELECT M.* 
            FROM public."Movie" M
            JOIN public."FavoriteMovie" F
            ON M.movie_id = F.movie_id
            ORDER BY M."imDbRating" DESC
            LIMIT 15
        `)
        return res.rows;
    }
    async getDetail(movie_id){
        const res = await db.query(`
            SELECT * 
            FROM public."Movie" M
            WHERE M.movie_id = $1
        `, [movie_id])
        return res.rows[0];
    }
    async getActorList(movie_id){
        const res = await db.query(`
            SELECT * 
            FROM public."Movie" M
            WHERE M.movie_id = $1
        `, [movie_id])
        if (res && res.rows.length > 0) {
            const actorIds = res.rows[0].actorList.map(actor => actor.id);
            const actorQuery = `
                SELECT * FROM public."Actor"
                WHERE actor_id IN (${actorIds.map(id => `'${id}'`).join(',')});
            `;
            const actors = await db.query(actorQuery);
            return actors.rows;
        }
        else{
            return [];
        }
    }
    async searchByTitle(input){
        if (!input || input.length === 0) {
            const res = await db.query(`
                SELECT * FROM public."Movie"
            `);
            return res.rows;
        }
        const res = await db.query(`
            SELECT * FROM public."Movie" m
            WHERE UPPER(m.title) LIKE UPPER('%' || $1 || '%')
        `, [input])
        return res.rows;
    }
    async searchByGenre(input){
        const res = await db.query(`
            SELECT *
            FROM public."Movie"
            WHERE EXISTS (
                SELECT 1
                FROM unnest("genreList") AS genre
                WHERE LOWER(genre) LIKE LOWER('%' || $1 || '%')
            );
        `, [input])

        return res.rows;
    }
    async addFavoriteMovies(movie_id) {
        try {
            // Check if the movie already exists in the FavoriteMovie table
            const checkExisting = await db.query(`
                SELECT * FROM public."FavoriteMovie"
                WHERE "movie_id" = $1
            `, [movie_id]);
            //console.log(checkExisting)
            if (checkExisting.rows.length > 0) {
                return false; // Movie already exists in favorites
            }
    
            // Movie does not exist in the FavoriteMovie table, proceed to insert
            await db.query(`
                INSERT INTO public."FavoriteMovie" ("movie_id")
                VALUES ($1)
            `, [movie_id]);
    
            return true; // Movie added to favorites successfully
        } catch (error) {
            return false; // Error occurred while adding movie to favorites
        }
    }
    async getFavoriteMovies(){
        const res = await db.query(`
            SELECT M.* FROM public."FavoriteMovie" F JOIN public."Movie" M
            ON F.movie_id = M.movie_id
        `);
        return res.rows;
    }
    async deleteFavoriteMovie(movie_id){
        // Check if the movie already exists in the FavoriteMovie table
        const checkExisting = await db.query(`
            SELECT * FROM public."FavoriteMovie"
            WHERE "movie_id" = $1
        `, [movie_id]);

        if (checkExisting.rows.length == 0) {
            return false; // Movie is not in favorites
        }

        await db.query(`
            DELETE FROM public."FavoriteMovie"
            WHERE "movie_id" = $1
        `, [movie_id])
        return true;
    }
}

module.exports = new Movie;