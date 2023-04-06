const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
// const {doubleCsrf} = require('csrf-csrf')
// import { doubleCsrf } from "csrf-csrf";
const csrf = require('csurf')
const flash = require('connect-flash')

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI =
  'mongodb+srv://riyaashah402:wMB0h5E6y2jErofF@cluster0.sdwkice.mongodb.net/mongooseShop';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf()
// const csrfProtection = doubleCsrf({
//   // getSecret: (req) => req.secret,
//   secret: CSRF_SECRET, 
//   cookieName: CSRF_COOKIE_NAME,
//   cookieOptions: { sameSite: false, secure: false, signed: true }, // not ideal for production, development only
//   size: 64,
//   ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
// })

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection)
app.use(flash())

app.use((req, res, next) => {
  // throw new Error('Sync Dummy Error') handled error vada middleware ma jse bcz sync 6
  if (!req.session.user) {
    return next();
  }
  
  User.findById(req.session.user._id)
    .then(user => {
      if(!user){
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      // throw new Error(err); not handled bcy async ma 6
      next(new Error(err))
    })
    // .catch(err => console.log(err));
});

app.use((req,res,next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// app.use(errorController.get500);
app.get('/500',errorController.get500);
app.use(errorController.get404);

app.use((error,req,res,next) => {
  // res.status(error.httpStatusCode).render()
  res.redirect('/500')
})

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    console.log("Connected")
    app.listen(4000);
  })
  .catch(err => {
    console.log(err);
  });
