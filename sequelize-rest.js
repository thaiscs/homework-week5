const Sequelize = require("sequelize");
const databaseURL =
  process.env.DATABASE_URL ||
  "postgres://postgres:secret@localhost:5432/postgres";
const db = new Sequelize(databaseURL);

// SERVER
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// BODY PARSER
const bodyParser = require("body-parser");
const parserMiddleware = bodyParser.json();
app.use(parserMiddleware);

// MODEL
const Movie = db.define("movie", {
  title: {
    type: Sequelize.TEXT
  },
  yearOfRelease: {
    type: Sequelize.INTEGER
  },
  synopsis: {
    type: Sequelize.TEXT
  }
});

db.sync()
  .then(() => console.log("Database connected"))
  .then(() => {
    const movies = [
      {
        title: "The Matrix",
        yearOfRelease: 1999,
        synopsis:
          "Thomas Anderson, a computer programmer, is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix."
      },
      {
        title: "Inception",
        yearOfRelease: 2010,
        synopsis:
          "Cobb steals information from his targets by entering their dreams. He is wanted for his alleged role in his wife's murder and his only chance at redemption is to perform the impossible, an inception."
      },
      {
        title: "In Time",
        yearOfRelease: 2011,
        synopsis:
          "In a future where time is money and the wealthy can live forever, Will Salas (Justin Timberlake) is a poor man who rarely has more than a day's worth of life on his time clock. When he saves Henry Hamilton (Matt Bomer) from time thieves, Will receives the gift of a century. "
      }
    ];
    const moviePromises = movies.map(movie => Movie.create(movie));
    return Promise.all(moviePromises);
  })

  .catch(console.error);

// RESTful C.R.U.D.

app.post("/movie", (req, res, next) => {
  Movie.create(req.body)
    .then(movie => res.json(movie))
    .catch(error => next(error));
});

app.get("/movie", (req, res, next) => {
  Movie.findAll()
    .then(movies => {
      res.send(movies);
    })
    .catch(error => next(error));
});

app.get("/movie/:id", (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(movie => {
      res.send(movie);
    })
    .catch(error => next(error));
});

app.put("/movie/:id", (request, response, next) =>
  Movie.findByPk(request.params.id)
    .then(movie => movie.update(request.body))
    .then(movie => response.send(movie))
    .catch(error => next(error))
);

app.delete("/movie/:id", (request, response, next) =>
  Movie.destroy({ where: { id: request.params.id } })
    .then(number => response.send({ number }))
    .catch(error => next(error))
);

// PAGINATION

app.get("/movies", (req, response, next) => {
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;

  Movie.findAndCountAll({ limit, offset })
    .then(result => {
      const pageCount = Math.ceil(result.count / limit);
      response.send({ data: result.rows, total: result.count, pageCount });
    })
    .catch(error => next(error));
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
