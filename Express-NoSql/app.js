// import { engine } from 'express-handlebars';
const { engine } = require('express-handlebars');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); 


const app = express();

app.set('view engine','ejs')
app.set('views','views')

const errorController = require('./controllers/error')
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./modles/user')

const adminRoutes = require('./routes/admin')
// const adminData = require('./routes/admin')
const shopRoutes = require('./routes/shop')

// req.body ne parse krva
app.use(bodyParser.urlencoded({extended: false}));
// to use public folder files statically
app.use(express.static(path.join(__dirname,'public')))

app.use((req,res,next) => {
    User.findById("641c2b7821a65cd883dd74a9")
    .then(user => {
        // req.user = user;
        req.user = new User(user.name, user.email, user.cart, user._id);
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

mongoConnect(() => {
  // console.log(client);
  app.listen(4000)
})