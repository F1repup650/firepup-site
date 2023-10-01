const express = require("express");
const app = express();
const fileloc = __dirname+"/public"
const err404loc = __dirname+"/404.html"
const err500loc = __dirname+"/500.html"
const files = express.static(fileloc)

app.use(files);
app.get("/cause-error-500", function(req, res, next) {
  throw new Error("Intentional 500 error");
});
app.get("/cause-error-404", function(req, res) {
  res.status(404).send("Intentional 404 error");
});
app.use(function(req, res, next) {
  res.status(404).sendFile(err404loc);
});
app.use(function(error, req, res, next) {
  res.sendStatus(500).sendFile(err500loc);
});

app.listen(8080);