const express = require('express');
const path = require('path');
const router = express.Router();

const rootDir = require('../util/path')

const products = [];

// /admin/add-product => GET
router.get('/add-product',(req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views','add-product.html'));
    res.render('add-product', {
        pageTitle: 'Add Product', 
        activePath : '/admin/add-product',
        activeAddProduct : true,
        productCss : true,
        formsCSS : true
    });
})

// /admin/add-product => POST
router.post('/add-product', (req,res,next) => {
    // console.log(req.body);
    products.push({title: req.body.title})
    res.redirect('/')
})

// module.exports = router;
module.exports.routes = router;
exports.products = products;