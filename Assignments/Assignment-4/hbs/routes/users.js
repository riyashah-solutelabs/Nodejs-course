const express = require('express');
const route = express.Router();
const path = require('path')

const users = [];

const rootDir = require('../util/path')
route.get('/', (req,res,next) => {
    // res.sendFile(path.join(rootDir,'views','users.html'));
    res.render('users',{pageTitle : 'Add Users' , activePath : '/', productsCSS : true, formsCSS : true , activeUsers : true});
})
route.post('/', (req,res,next) => {
    console.log(req.body.name);
    users.push({name:req.body.name})
    res.redirect('/users')
})


exports.route = route;
exports.users = users;