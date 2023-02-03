/**
 * dotenv Config
 */
require("dotenv").config();

const createError = require('http-errors');
const express = require('express');
const cors = require("cors");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const { seoConfigMiddleware } = require("./middlewares/seo.middleware");
const { initDatabase } = require("./configs");
require("./models");
const favicon = require("serve-favicon");

const app = express();

//region view engine setup
app.use(cookieParser(process.env.SECRET_KEY));
app.use(logger('dev'));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(favicon("./public/images/favicon-32x32.png"));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
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
app.use(function (req, res, next) {
    next(createError(404));
});
//endregion

//region error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 403);
    res.render('error');
});
//endregion

module.exports = app;
