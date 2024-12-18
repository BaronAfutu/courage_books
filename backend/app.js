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
const { loggedInUser, loggedInAdmin } = require('./middlewares/loginRequired');


// *******REQUIRE ROUTES*************
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/userRoutes');
const booksRouter = require('./routes/bookRoutes');
const cartRouter = require('./routes/cartRoutes');
const wishlistRouter = require('./routes/wishlistRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const orderRouter = require('./routes/orderRoutes');
const paymentRouter = require('./routes/paymentRoutes');
const uploadRouter = require('./routes/fileUploadRoutes');



const app = express();

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
    defaultSrc: ["'self'", 'https://checkout.paystack.com'],
    scriptSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net", "https://checkout.paystack.com https://*.paystack.co "],
    styleSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
    imgSrc: ["'self'", "data:", "https://via.placeholder.com/"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net", "https://fonts.gstatic.com"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
}));
app.use(cors());
app.options('*', cors());



// ************** USE ROUTES *********
app.use('/', indexRouter);

app.use('/user',loggedInUser);
app.use('/user',usersRouter);

app.use('/api/v1/', authJwt());
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/books', booksRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/wishlist', wishlistRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/uploads', uploadRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'DEV' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if (process.env.NODE_ENV === 'DEV') {
    res.render('error', { title: 'Not Found' });
  } else {
    res.render('notfound', { title: 'Not Found', user: undefined, token: '' });
  }
});

module.exports = app;
