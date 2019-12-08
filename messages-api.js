const express = require("express");

// BODY PARSER
const bodyParser = require("body-parser");
const parserMiddleware = bodyParser.json();

// SERVER INIT
const app = express();
const port = process.env.PORT || 3000;
app.use(parserMiddleware);
app.listen(port, () => console.log(`Listening on port ${port}!`));

// VALIDATION FUNCTION
let count = 1;
const validationMiddleware = (req, res, next) => {
  if (count > 5) {
    return res.status(429).end();
  } else {
    count++;
    next();
  }
};

// API single end-point
app.post("/messages", validationMiddleware, (req, res, next) => {
  console.log(req.body.text);
  if (!req.body.text || req.body.text === "") {
    return res
      .status(400)
      .send({ message: "Please make a request body with a text property" });
  } else {
    return res.json({
      message: "Message received loud and clear"
    });
  }
});
