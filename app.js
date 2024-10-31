const express = require('express');
const Validator = require("fastest-validator");
const v = new Validator();
const morgan = require('morgan')


const app = express();
app.use(morgan('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!')
});

var auth = require("./services/auth");
var categories = require("./services/categories");
const news = require("./services/news");

app.use("/v1/auth", auth);
app.use("/v1/categories", categories);
app.use("/v1/news", news);


module.exports = { app };