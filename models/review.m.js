const db = require('../config/connection')

class Review{
    async get(movie_id){
        const res = await db.query(`
            SELECT * 
            FROM public."Review"
            WHERE movie_id = $1
        `, [movie_id])
        
        if (res){
            const reviews = res.rows[0].reviewContent;
            return reviews;
        } 
        else{
            return [];
        }
    }
}

module.exports = new Review;