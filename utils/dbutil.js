const { Pool } = require('pg');
require('dotenv').config();

async function createDB() {
  const db = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DB, 
    password: process.env.DB_PW,
    port: process.env.DB_PORT,
  });

  try {
    await db.connect();

    // Check if the specified database exists
    const result = await db.query(`SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}';`);
    if (result.rowCount === 0) {
      // Create the specified database if it doesn't exist
      await db.query(`CREATE DATABASE ${process.env.DB_NAME};`);
      console.log(`Database ${process.env.DB_NAME} created successfully`);
    } else {
      console.log(`Database ${process.env.DB_NAME} already exists`);
    }

    // Connect to the newly created database
    const pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PW,
      port: process.env.DB_PORT,
    });

    await pool.connect();
    console.log(`Connected to database ${process.env.DB_NAME}`);

    // Now, create the necessary tables
    await pool.query(`
    CREATE TABLE IF NOT EXISTS "Movie" (
      "movie_id" VARCHAR(255) PRIMARY KEY,
      "title" VARCHAR(255),
      "originalTitle" VARCHAR(255),
      "fullTitle" VARCHAR(255),
      "year" VARCHAR(4),
      "image" TEXT,
      "releaseDate" DATE,
      "runtimeStr" TEXT,
      "plot" TEXT,
      "awards" VARCHAR(255),
      "directorList" TEXT[],
      "writerList" TEXT[],
      "actorList" JSON[],
      "genreList" TEXT[],
      "companies" VARCHAR(255),
      "countries" VARCHAR(255),
      "languages" VARCHAR(255),
      "imDbRating" VARCHAR(10),
      "posters" TEXT[],
      "images" JSON[],
      "boxOffice" VARCHAR(255),
      "plotFull" TEXT,
      "similars" TEXT[]
    );
  `);

    // Create table for actors
    await pool.query(`
        CREATE TABLE IF NOT EXISTS "Actor" (
        actor_id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        role VARCHAR(255),
        image VARCHAR(255),
        summary TEXT,
        "birthDate" DATE,
        "deathDate" DATE,
        awards VARCHAR(255),
        height VARCHAR(255),
        "castMovies" JSON[],
        images JSON[]
        );
    `);

    // Create table for reviews
    await pool.query(`
        CREATE TABLE IF NOT EXISTS "Review" (
        review_id SERIAL PRIMARY KEY,
        movie_id VARCHAR(255) REFERENCES "Movie"(movie_id),
        "reviewContent" JSON[]
        );
    `);

    // Create table for favorite movies
    await pool.query(`
        CREATE TABLE IF NOT EXISTS "FavoriteMovie" (
        fav_id SERIAL PRIMARY KEY,
        movie_id VARCHAR(255) REFERENCES "Movie"(movie_id) ON DELETE CASCADE
        );
    `);

        console.log('Tables created successfully');
        // pool.end();
        // db.end();
        //console.log('Connection to the database closed');
    } catch (err) {
        console.error('Error occurred:', err);
        await db.end(); // Close the connection
    }
}

module.exports = createDB;
