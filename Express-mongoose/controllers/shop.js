// const Product = require('../models/product');
const Product = require('../modles/product')
// const Cart = require('../modles/cart')
const Order = require('../modles/order')

exports.getProducts = (req, res, next) => {
  // Product.find().cursor().eachAsync() //or  Product.find().cursor().eachAsync().next()
  Product.find()
    .then(products => {
      console.log(products);
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
  Product.find()
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
  .populate('cart.items.productId')
  // .execPopulate()
    .then(user => {
      const products = user.cart.items;
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
  req.user.removeFromCart(prodId)
  .then(result => {
    console.log("result :" ,result);
    res.redirect('/cart');
  })
  .catch(err => console.log(err))
};

exports.postOrder = (req,res,next) => {
  req.user
  .populate('cart.items.productId')
  .then(user => {
    console.log(user.cart.items);
    const products = user.cart.items.map(i => {
      return {quantity : i.quantity , product : {...i.productId._doc}}
    })
    const order = new Order({
      user : {
        name : req.user.name,
        userId : req.user
      },
      products : products,
    })
    return order.save()
  })
  .then(() => {
    return req.user.clearCart()
  })
  .then(() => {
    res.redirect('/orders')
  })
  .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
  Order.find({"user.userId" : req.user._id})
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
