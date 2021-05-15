var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
const config = require('./config/database')
const bodyParser = require('body-parser')
const session = require('express-session')
const { check, validationResult } = require('express-validator')
const fileUpload = require('express-fileupload')
const passport = require('passport')
var flash = require('connect-flash');
// end module including section


//connecting to databaese begin

mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'))

db.once('open', () => {
  console.log('connected to Mongodb')
})

//connecting to database end

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//express session middleware

app.use(session({
  secret: 'AverybigSecretwithforseesion',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
}))

app.use(flash());

//express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


//passport config

require('./config/passport')(passport)

//passport middleware

app.use(passport.initialize())
app.use(passport.session())

app.get('*', (req, res, next) => {
  res.locals.cart = req.session.cart;
  res.locals.user = req.user || null;
  next();
})

app.post('*', (req, res, next) => {
  res.locals.cart = req.session.cart;
  res.locals.user = req.user || null;
  next();
})

//setting up global error variable

app.locals.errors = "";

//get all categories for header 

let Category = require('./models/category')
//get all the category to pass at header ejs
Category.find((err, categories) => {
  if (err) {
    console.log(err)
  } else {
    app.locals.categories = categories
  }
})

///end

//setting routes
const users = require('./routes/users.js')
const cart = require('./routes/cart.js')
const products = require('./routes/products.js')
const adminDashboard = require('./routes/admin_dashboard.js')
const adminCategories = require('./routes/admin_categories.js')
const adminProducts = require('./routes/admin_products.js')
const adminOrders = require('./routes/admin_orders.js')



app.use('/', products)
app.use('/cart', cart)
app.use('/users', users)
app.use('/admin/dashboard', adminDashboard)
app.use('/admin/categories', adminCategories)
app.use('/admin/products', adminProducts)
app.use('/admin/orders', adminOrders)
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');


// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
