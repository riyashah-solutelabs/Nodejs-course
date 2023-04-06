// const products = [];
const Product = require('../modles/product')
const Cart = require('../modles/cart')


exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    .then(([rows,fieldData]) => {
        res.render('shop/product-list',{
            prods : rows , 
            pageTitle : 'All Products', 
            path : '/products', 
        });
    })
    .catch(err => console.log(err)) 
}

// get product detail by id
exports.getProduct = (req,res,next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(([product]) => {
        // console.log(product);
        res.render('shop/product-detail',{
            product : product[0] , 
            pageTitle : product[0].title, 
            path : '/products', 
            // layout : false
        });
    })
    .catch(err => console.log(err));

    // res.redirect('/')
}

exports.getIndex = (req,res,next) => {
    Product.fetchAll()
    .then(([rows, fieldData]) => {
        res.render('shop/index',{
            prods : rows , 
            pageTitle : 'Shop', 
            path : '/'
        });
    })
    .catch(err => console.log(err)); 
}

exports.getCart = (req,res,next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = []
            for(product of products){
                const cartProductData = cart.products.find(prod => prod.id === product.id)
                if(cart.products.find(prod => prod.id === product.id)){
                    cartProducts.push({productData : product , qty : cartProductData.qty})
                }
            }
            res.render('shop/cart', {
                path : '/cart',
                pageTitle : 'Your Cart',
                products : cartProducts
            })
        })
    })
}

exports.postCart = (req,res,next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
    });
    console.log(prodId);
    res.redirect('/cart');
};

exports.postCartDeleteProduct = (req,res,next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, (product) => {
        // console.log(product);
        Cart.deleteProduct(prodId,product.price)
        res.redirect('/cart');
    });
};

exports.getOrders = (req,res,next) => {
    res.render('shop/orders', {
        path : '/orders',
        pageTitle : 'Your Orders'
    })
}

exports.getCheckout = (req,res,next) => {
    res.render('shop/checkout', {
        activePath : '/checkout',
        pageTitle : 'Checkout'
    })
}