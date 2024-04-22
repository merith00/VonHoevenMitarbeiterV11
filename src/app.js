if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config
}
var createError = require('http-errors');
var express = require('express');


var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const initializePassport = require('./UserAuth/passport-config')
const passport = require('passport')
const getUserByEmail = require('./database/oracle').getUserByEmail
const getUserById = require('./database/oracle').getUserById
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

var indexRouter = require('./routes');
var usersRouter = require('./routes/users');
var cartRouter = require('./routes/cart');
var productsRouter = require('./routes/products');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'))
app.use(express.json({ limit: '10mb' }));

//Setup Passport

initializePassport(passport,getUserByEmail,getUserById)
app.use(flash())
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/cart', cartRouter);
app.use('/products', productsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
