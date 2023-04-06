// const Product = require('../models/product');
const Product = require('../modles/product')
// const Cart = require('../modles/cart')
// const Order = require('../modles/order')

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));

    // if we use .toArray() instead of next() in model we have to acces using [0]
  // Product.findById(prodId)
  //   .then(product => {
  //     res.render('shop/product-detail', {
  //       product: product[0],
  //       pageTitle: product[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(products => {
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
          });
        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
  .then(product => {
      return req.user.addToCart(product)
  })
  .then(result => {
    console.log(result);
    res.redirect('/cart');
  })
  .catch(err => {
    console.log(err);
  })
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.deleteItemFromCart(prodId)
  .then(result => {
    console.log("result :" ,result);
    res.redirect('/cart');
  })
  .catch(err => console.log(err))
};

exports.postOrder = (req,res,next) => {
  let fetchedCart ;
  req.user.addOrder()
  .then(() => {
    res.redirect('/orders')
  })
  .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders()
  .then(orders => {
    // console.log(orders);
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders : orders
    });
  })
  .catch(err => console.log(err))
};

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     path: '/checkout',
//     pageTitle: 'Checkout'
//   });
// };
