// import { engine } from 'express-handlebars';
const { engine } = require('express-handlebars');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); 

const mongoose = require('mongoose')


const app = express();

app.set('view engine','ejs')
app.set('views','views')

const errorController = require('./controllers/error')
const User = require('./modles/user')

const adminRoutes = require('./routes/admin')
// const adminData = require('./routes/admin')
const shopRoutes = require('./routes/shop')

// req.body ne parse krva
app.use(bodyParser.urlencoded({extended: false}));
// to use public folder files statically
app.use(express.static(path.join(__dirname,'public')))

app.use((req,res,next) => {
    User.findById("641d58bd55705174f64d4cf0")
    .then(user => {
        // req.user = user;
        req.user = user;
        next();
    })
    .catch(err => {
      console.log(err)
    })
})

app.use('/admin',adminRoutes)
// app.use('/admin',adminData.routes)
app.use(shopRoutes)

app.use(errorController.get404)

mongoose.connect('mongodb+srv://riyaashah402:wMB0h5E6y2jErofF@cluster0.sdwkice.mongodb.net/mongooseShop')
.then(result => {
  User.findOne()
  .then(user => {
    if(!user){
      const user = new User({
        name : 'Riya',
        email : 'riya@test.com',
        cart : {
          items : []
        }
      })
      user.save();
    }
  })
  console.log("Connected");
  app.listen(4000)
})
.catch(err => {
  console.log(err);
})