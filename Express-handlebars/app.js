// import { engine } from 'express-handlebars';
const { engine } = require('express-handlebars');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); 
const rootDir = require('./util/path')
const expressHbs = require('express-handlebars')
// const hbs = require('hbs')

const app = express();

// app.engine('hbs', expressHbs({layoutsDir: 'views/layouts/',defaultLayout: 'main-layout', extname:'hbs'}))
app.engine('hbs', engine({extname:'hbs', layoutsDir: 'views/layouts/',defaultLayout: 'main-layout'}))
app.set('view engine','hbs')
app.set('views','views')

// const adminRoutes = require('./routes/admin')
const adminData = require('./routes/admin')
const shopRoutes = require('./routes/shop')


// req.body ne parse krva
app.use(bodyParser.urlencoded({extended: false}));
// to use public folder files statically
app.use(express.static(path.join(__dirname,'public')))

// app.use('/admin',adminRoutes)
app.use('/admin',adminData.routes)
app.use(shopRoutes)

app.use((req,res,next) => {
    // res.status(404).send('<h1>404 Error!!Page Not Found....</h1>')
    // res.status(404).sendFile(path.join(rootDir,'views','404.html'))
    res.status(404).render('404',{pageTitle : 'Error Page'})
})

app.listen(4000)