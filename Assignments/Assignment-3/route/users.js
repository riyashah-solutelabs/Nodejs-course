const express = require('express');
const route = express.Router();
const path = require('path');

route.get('/add-users',(req,res,next) => {
        // console.log("In another Middleware");
    // res.end()
    // next()
    // res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
    // res.sendFile(path.join(__dirname, '../views/add-product.html'));
    // console.log(rootDir);
    res.sendFile(path.join(__dirname , '../','views','users.html'));
})
route.post('/add-users',(req,res,next) => {
    console.log(req.body);
    res.redirect('/')
})

module.exports = route;