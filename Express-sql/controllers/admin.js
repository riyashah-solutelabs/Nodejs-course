const Product = require('../modles/product')

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views','add-product.html'));
    res.render('admin/edit-product', {
        pageTitle: 'Add Product', 
        path : '/admin/add-product',
        editing : false
        // activeAddProduct : true,
        // productCss : true,
        // formsCSS : true
    });
}

exports.postEditProduct = (req,res,next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    const updatedProduct = new Product(prodId, updatedTitle, updatedImageUrl, updatedPrice, updatedDesc)
    updatedProduct.save();

    res.redirect('/admin/products')
}

exports.postAddProduct = (req,res,next) => {
    // console.log(req.body);
    // products.push({title: req.body.title})
    // const product = new Product(req.body.title)
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    console.log(price);
    const description = req.body.description;
    const product = new Product(null ,title,imageUrl,price,description)
    product.save()
    .then(() => {
        res.redirect('/')
    })
    .catch(err => console.log(err));
}

exports.getEditProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views','add-product.html'));
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect('/')
    }
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        if(!product){
            return res.redirect('/')
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product', 
            path : '/admin/edit-product',
            editing : editMode,
            product : product
            // activeAddProduct : true,
            // productCss : true,
            // formsCSS : true
        });
    })
}

exports.postDeleteProduct = (req,res,next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId);
    res.redirect('/admin/products')
}

exports.getProducts = (req,res,next) => {
    Product.fetchAll((products) => {
        res.render('admin/products',{
            prods : products , 
            pageTitle : 'Admin Products', 
            path : '/admin/products'
            // hasProducts : products.length > 0, activeShop : true,
            // productCSS : true
            // layout : false
        });
    });
}