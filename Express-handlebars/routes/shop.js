const express = require('express');
const path = require('path');
const router = express.Router();
const rootDir = require('../util/path')

const adminData = require('./admin');

router.get('/',(req, res, next) => {
    // console.log("In another Middleware");
    // res.end()
    // console.log(__dirname,'../views');
    // res.sendFile(path.join(__dirname,'../views','shop.html'));
    // res.sendFile(path.join(__dirname,'../','views','shop.html'));
    // console.log(adminData.products);
    // res.sendFile(path.join(rootDir,'views','shop.html'));
    const products = adminData.products;
    res.render('shop',{
        prods : products , 
        pageTitle : 'Shop', 
        activePath : '/admin/shop', 
        hasProducts : products.length > 0, activeShop : true,
        productCSS : true
        // layout : false
    });
    // res.send({
    //     "name":"riya",
    //     "surname":"shah"
    // });
})

module.exports = router;