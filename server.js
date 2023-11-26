require('dotenv').config();
const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const app = express();
const port = process.env.PORT;

const mainRouter = require("./routes/main.r");
const favRouter = require("./routes/fav.r");
const movieRouter = require("./routes/movie.r");
const actorRouter = require("./routes/actor.r");

const createDB = require('./utils/dbutil');
const initDB = require('./utils/initDB');

async function startApp() {
  // Parsing middleware
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));

  // Template engine
  app.engine('.hbs', handlebars.engine({
    extname: '.hbs', 
    defaultLayout: 'main', 
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    helpers: {
      times: function(n, block) {
        let accum = '';
        for (let i = 1; i <= n; i++) {
          accum += block.fn(i);
        }
        return accum;
      },
      ifEquals: function(arg1, arg2, options) {
        return arg1 === arg2 ? options.fn(this) : options.inverse(this);
      }
    }
  }));

  app.set('view engine', '.hbs');
  app.set('views', path.join(__dirname, 'views'));
  
  app.use((err, req, res, next) => {
    const statusCode = err.statusCode | 500;
    res.status(statusCode).send(err.message);
  });

  //Routing
  app.use("", mainRouter);
  // app.use("/fav", favRouter);
  app.use("/movie", movieRouter);
  // app.use("/actor", actorRouter);

  try {
    await createDB();
    await initDB();
    app.listen(port, () => console.log(`Listening on port ${port}`));
  } catch (error) {
    console.error('Error starting the app:', error);
  }
}

startApp();
