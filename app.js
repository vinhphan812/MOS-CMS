/**
 * dotenv Config
 */
require("dotenv").config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const { seoConfigMiddleware } = require("./middlewares/seo.middleware");
const { initDatabase } = require("./configs");
require("./models");

const app = express();

//region view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SECRET_KEY));
app.use("/public", express.static(path.join(__dirname, "public")));
//endregion

//region init database
initDatabase();
//endregion

//region middlewares
app.use(seoConfigMiddleware);
//endregion

//region setup routes
app.use('/', indexRouter);
//endregion

//region catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
//endregion

//region error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
//endregion

module.exports = app;
