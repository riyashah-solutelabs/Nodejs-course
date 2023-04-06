// import { engine } from 'express-handlebars';
const { engine } = require('express-handlebars');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); 

const errorController = require('./controllers/error')
const db = require('./util/database')

const app = express();

app.set('view engine','ejs')
app.set('views','views')

const adminRoutes = require('./routes/admin')
// const adminData = require('./routes/admin')
const shopRoutes = require('./routes/shop')

db.execute('SELECT * FROM products')
.then((result) => {
    console.log(result);
}).catch(err => {

})


// req.body ne parse krva
app.use(bodyParser.urlencoded({extended: false}));
// to use public folder files statically
app.use(express.static(path.join(__dirname,'public')))

app.use('/admin',adminRoutes)
// app.use('/admin',adminData.routes)
app.use(shopRoutes)

app.use(errorController.get404)
// app.use((req,res,next) => {
//     // res.status(404).send('<h1>404 Error!!Page Not Found....</h1>')
//     // res.status(404).sendFile(path.join(rootDir,'views','404.html'))
//     res.status(404).render('404',{pageTitle : 'Error Page'})
// })

app.listen(4000)