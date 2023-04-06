const express = require('express');
const route = express.Router();
const path = require('path')
const user = require('./users')

const rootDir = require('../util/path')

route.get('/users', (req,res,next) => {
    // console.log(user.users[0].name);
    // res.sendFile(path.join(rootDir,'views','usersList.html'))
    res.render('usersList', { pageTitle : 'Users', users : user.users , activePath : '/users', hasUsers : user.users.length > 0, productsCSS : true , activeList : true})
})

exports.route = route;