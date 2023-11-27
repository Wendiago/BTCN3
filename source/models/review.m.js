const db = require('../config/connection')

class Review{
    async getReview(movie_id){
        const res = await db.query(`
            SELECT * 
            FROM public."Review"
            WHERE movie_id = $1
        `, [movie_id])
        
        const reviews = res.rows;
        if (reviews.length === 0){
            return [];
        }
        //console.log(reviews);
        return reviews[0].reviewContent;
    }
}

module.exports = new Review;