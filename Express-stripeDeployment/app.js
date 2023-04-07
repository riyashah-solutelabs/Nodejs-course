const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI =
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.sdwkice.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
  destination : (req,file,cb) => {
    cb(null, 'images')
  } ,
  filename : (req,file,cb) => {
    // cb(null, file.filename + '-' + file.originalname)
    // cb(null, new Date().toISOString() + '-' + file.originalname)
    // const date = new Date().toLocaleTimeString();
    // const randomNumber = Math.random();
    const randomNumber = Math.round(Math.random() * 1E9);
    cb(null, randomNumber + '-' + file.originalname)
  }
})
// console.log(new Date().toLocaleTimeString())

const fileFilter = (req,file,cb) => {
  if(file.mimetype === 'image/png' || file.mimetype == 'image/jpg' || file.mimetype === 'image/jpeg'){
    cb(null,true);
  }
  cb(null,false)
}

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(multer({dest : 'images'}).single('image'))
app.use(multer({storage : fileStorage, fileFilter: fileFilter}).single('image'))
// console.log(fileStorage.getFilename())

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));

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
  console.log(error.message)
  res.redirect('/500')
  // res.render('500', {
  //   pageTitle: 'Error',
  //   path: '/500',
  //   hasError : false,
  //   errorMessage : null,
  //   validationErrors : [],
  //   errorMessage : error.message
  // })
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
