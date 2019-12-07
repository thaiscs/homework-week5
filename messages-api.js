const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const parserMiddleware = bodyParser.json();

app.use(parserMiddleware);

// TESTED SUCESSFULLY WITH: http -v :3000/messages foo=bar
app.post("/messages", (req, res, next) => {
  console.log(req.body);
  res.json({
    message: "Message received loud and clear"
  });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
