const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const parserMiddleware = bodyParser.json();
const reqBodyParserText = bodyParser.text({ type: "*/*" });

// app.use(parserMiddleware);
app.use(reqBodyParserText);

let limit = 5;

const numberOfRequests = () => (req, res, next) => {
  if (req.body) {
    return limit--;
  } else if (limit === 0) {
    return res.status(429);
  }
  next();
};

app.post("/messages", numberOfRequests, (req, res, next) => {
  req.accepts(["text"]);
  req.get("content-type");
  console.log(req.body);

  if (!req.body || !req.is("text/html")) {
    return res.status(400).send({ message: "Please make a request body" });
  } else {
    return res.json({
      message: "Message received loud and clear"
    });
  }
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
