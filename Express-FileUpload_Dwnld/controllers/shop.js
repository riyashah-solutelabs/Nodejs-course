const fs = require('fs')
const path = require('path')

const PDFDocument = require('pdfkit')

const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      console.log(products);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        // isAuthenticated: req.session.isLoggedIn
      });
    })
    // .catch(err => {
    //   console.log(err);
    // });
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500;
      return next(error)
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
        // isAuthenticated: req.session.isLoggedIn
      });
    })
    // .catch(err => console.log(err));
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500;
      return next(error)
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        // isAuthenticated: req.session.isLoggedIn,
        // csrfToken : req.csrfToken()
      });
    })
    // .catch(err => {
    //   console.log(err);
    // });
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500;
      return next(error)
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
        products: products,
        // isAuthenticated: req.session.isLoggedIn
      });
    })
    // .catch(err => console.log(err));
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500;
      return next(error)
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    // .catch(err => console.log(err));
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500;
      return next(error)
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    // .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          // name: req.user.name,
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    // .catch(err => console.log(err));
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500;
      return next(error)
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        // isAuthenticated: req.session.isLoggedIn
      });
    })
    // .catch(err => console.log(err));
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500;
      return next(error)
    });
};

exports.getInvoice = (req,res,next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
  .then(order => {
    if(!order){
      return next(new Error('No order Found!'))
    }
    if(order.user.userId.toString() !== req.user._id.toString()){
      // console.log('Unauthorized')
      return next(new Error('Unauthorized'))
    }
    const invoiceName = 'invoice-'+orderId+'.pdf';
    const invoicePath = path.join('data','invoices',invoiceName)

    const pdfDoc = new PDFDocument();
    res.setHeader('Content-Type','application/pdf')
    res.setHeader('Content-Disposition','inline; filename="'+ invoiceName +'"')
    // pdf we generate is store on server
    pdfDoc.pipe(fs.createWriteStream(invoicePath))
    // client ne moklva
    pdfDoc.pipe(res)

    // pdfDoc.text('Hello World!');
    pdfDoc.fontSize(26).text('Invoice',{
      underline : true
    })
    pdfDoc.text('---------------------------------')

    let totalPrice = 0;
    order.products.forEach(prod => {
      totalPrice += prod.quantity * prod.product.price;
      pdfDoc.fontSize(14).text(
          prod.product.title + 
          '-' + 
          prod.quantity + 
          'x' + 
          '$' + 
          prod.product.price
        )
    })
    pdfDoc.text('----')
    pdfDoc.fontSize(20).text('Totla Price : $' + totalPrice)

    pdfDoc.end();
  //   fs.readFile(invoicePath, (err,data) => {
  //   if(err){
  //     return next(err)
  //   }
  //   res.setHeader('Content-Type','application/pdf')
  //   // res.setHeader('Content-Disposition','attachment; filename="'+ invoiceName +'"')
  //   res.setHeader('Content-Disposition','inline; filename="'+ invoiceName +'"')
  //   res.send(data)
  // })
    // const file = fs.createReadStream(invoicePath)
    
    // file.pipe(res)
  })
  .catch(err => next(err))
}