const db = require('../config/connection');
require('dotenv').config;
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, `../db/${process.env.JSON_FILE}`);

async function initDB(){
    try {
        const jsonData = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(jsonData);
        const movies = data.Movies;
        //console.log(movies);
        const actors = data.Names;
        const reviews = data.Reviews;

        const insertMovieQuery = `
                INSERT INTO public."Movie" (
                    movie_id, title, "originalTitle", "fullTitle", year, image, "releaseDate",
                    "runtimeStr", plot, awards, "directorList", "writerList", "actorList",
                    "genreList", companies, countries, languages, "imDbRating", posters,
                    images, "boxOffice", "plotFull", similars
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
                    $16, $17, $18, $19, $20, $21, $22, $23
                )
        `;
        for (const movie of movies){
            //console.log(movie);
            const row = await db.query(`SELECT * FROM public."Movie" WHERE "movie_id" = $1`, [movie.id]);

            // Check if the row has any results 
            if (row.rows.length > 0) {
                continue; 
            }

            await db.query(insertMovieQuery, [
                movie.id, movie.title, movie.originalTitle, movie.fullTitle, movie.year, movie.image, movie.releaseDate,
                movie.runtimeStr, movie.plot, movie.awards, movie.directorList, movie.writerList, movie.actorList,
                movie.genreList, movie.companies, movie.countries, movie.languages, movie.imDbRating, movie.posters,
                movie.images, movie.boxOffice, movie.plotFull, movie.similars
            ]);
        }

        //Insert actors:
        const insertActorQuery = `
                INSERT INTO public."Actor" (
                    actor_id,
                    name,
                    role,
                    image,
                    summary,
                    "birthDate",
                    "deathDate",
                    awards,
                    height,
                    "castMovies",
                    images
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
                )
        `;
        
        for (const actor of actors){
            //console.log(movie);
            const row = await db.query(`SELECT * FROM public."Actor" WHERE "actor_id" = $1`, [actor.id]);

            // Check if the row has any results 
            if (row.rows.length > 0) {
                continue; 
            }

            await db.query(insertActorQuery, [
                actor.id,
                actor.name,
                actor.role,
                actor.image,
                actor.summary,
                actor.birthDate,
                actor.deathDate,
                actor.awards,
                actor.height,
                actor.castMovies,
                actor.images
            ]);
        }

        //Insert reviews
        const insertReviewQuery = `
            INSERT INTO public."Review"(
                movie_id,
                "reviewContent"
            ) VALUES (
                $1, $2
            )
        `;
        
        for (const review of reviews) {
            const movieExists = await db.query(`SELECT 1 FROM public."Movie" WHERE movie_id = $1`, [review.movieId]);
            if (!movieExists.rows.length) {
                console.log(`Movie with ID ${review.movieId} doesn't exist in the database.`);
                continue;
            }

            const movieInReviewExists = await db.query(`SELECT 1 FROM public."Review" WHERE movie_id = $1`, [review.movieId]);
            if (movieInReviewExists.rows.length) {
                continue;
            }

            await db.query(insertReviewQuery, [
                review.movieId, 
                review.items
            ])
        }        
    } catch (error) {
        console.log(error);
    }
}

module.exports = initDB;