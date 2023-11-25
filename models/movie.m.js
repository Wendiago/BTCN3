require('dotenv').config;
const fs = require('fs');
const path = `./db/${process.env.JSON_FILE}`;

class Movie{
    constructor(){
        this.db = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PW,
            port: process.env.DB_PORT,
        })
    }
    async importMovie(){
        try {
            const jsonData = fs.readFileSync(path, 'utf-8');
            const data = JSON.parse(jsonData);
            const movies = data.Movies;
            const insertMovieQuery = `
                INSERT INTO Movie (
                    movie_id, title, originalTitle, fullTitle, year, releaseDate,
                    runtimeStr, plot, awards, directorList, writerList, actorList,
                    genreList, companies, countries, languages, imDbRating, posters,
                    images, boxOffice, plotFull, similars
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
                    $16, $17, $18, $19, $20, $21, $22
                )
            `;

            for (const movie of movies){
                //Check if movie has already in the table
                const row = await db.query(`SELECT * FROM public.'Movie' WHERE 'movie_id' = $1`, [movie.id]);
                if (row != ''){
                    continue;
                }
                await this.db.query(insertMovieQuery, [
                    movie.movie_id, movie.title, movie.originalTitle, movie.fullTitle, movie.year, movie.releaseDate,
                    movie.runtimeStr, movie.plot, movie.awards, movie.directorList, movie.writerList, movie.actorList,
                    movie.genreList, movie.companies, movie.countries, movie.languages, movie.imDbRating, movie.posters,
                    movie.images, movie.boxOffice, movie.plotFull, movie.similars
                ]);

                
             }
        } catch (error) {
            
        }
    }
}

module.exports = Movie;