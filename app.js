const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

require('dotenv/config');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const MongoStore = require('connect-mongo')
const db = require('./config/db_mongo');
const authJwt = require('./helpers/jwt');


// *******REQUIRE ROUTES*************
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRoutes');
const booksRouter = require('./routes/bookRoutes');
const cartRouter = require('./routes/cartRoutes');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ********MIDDLEWARES************
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.CONNECTION_STRING
  })
}))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
    styleSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
    imgSrc: ["'self'", "data:"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
}));
app.use(cors());
app.options('*',cors());



// ************** USE ROUTES *********
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books',booksRouter);
app.use('/cart',authJwt());
app.use('/cart',cartRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'DEV' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
