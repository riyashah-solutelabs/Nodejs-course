const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  // ahi fuction() keyword j lkhvo so that this keyword refers to this schema and not something else
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({ productId: product._id, quantity: newQuantity });
  }
  const updatedCart = { items: updatedCartItems };
  this.cart = updatedCart;
  return this.save()
};

userSchema.methods.removeFromCart = function(productId){
    const updatedCartItems = this.cart.items.filter((item => {
        return item.productId.toString() !== productId.toString();
    }))
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function(){
    this.cart = {items : []}
    return this.save();
}


module.exports = mongoose.model("User", userSchema);

// const getDb = require('../util/database').getDb;
// const mongodb = require('mongodb')
// const ObjectId = mongodb.ObjectId;

// class User {
//     constructor(username, email, cart, id){
//         this.name = username;
//         this.email = email;
//         this.cart = cart; // {items : []}
//         this._id = id;
//     }

//     save(){
//         const db = getDb();
//         return db.collection('users').insertOne(this)
//         .then(users => {
//             console.log(users);
//         })
//         .catch(err => console.log(err))
//     }

//     addToCart(product){
//         // to check product is exist or not
//         const cartProductIndex = this.cart.items.findIndex(cp => {
//             return cp.productId.toString() === product._id.toString();
//         });
//         let newQuantity = 1;
//         const updatedCartItems = [...this.cart.items]
//         if(cartProductIndex >= 0){
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQuantity;
//         }else{
//             updatedCartItems.push({productId : product._id, quantity : newQuantity})
//         }
//         // product.quantity = 1;
//         // const updateCart = {items : [product]}
//         // or
//         // const updatedCart = {items : [{...product, quantity : 1}]};
//         const updatedCart = {items : updatedCartItems};
//         const db = getDb();
//         return db.collection('users').updateOne({_id : new ObjectId(this._id)},
//         {$set : {cart : updatedCart}})
//     }

//     // getCart(){
//     //     // return this.cart();
//     //     const db = getDb();
//     //     const productIds = this.cart.items.map(i => {
//     //         return i.productId;
//     //     })
//     //     return db.collection('products').find({_id : {$in : productIds}})
//     //     .toArray()
//     //     .then(products => {
//     //         return products.map(p => {
//     //             return {...p, quantity : this.cart.items.find(i => {
//     //                 return i.productId.toString() === p._id.toString();
//     //             }).quantity
//     //         };
//     //         })
//     //     })
//     // }
//     getCart(){
//         // return this.cart();
//         const db = getDb();
//         const productIds = this.cart.items.map(i => {
//             return i.productId;
//         })
//         return db.collection('products').find({_id : {$in : productIds}})
//         .toArray()
//         .then(products => {
//              // remove any items from the cart that are not available in the products collection
//             this.cart.items = this.cart.items.filter(item => {
//                 const product = products.find(p => p._id.toString() === item.productId.toString());
//                 return product !== undefined;
//             });
//             let update = [...this.cart.items]
//             console.log("update ",update);
//             db.collection('users').updateOne({_id : new ObjectId(this._id)},{$set : {cart : {items : update}}})
//             console.log(products);
//             if(products.length > 0){
//                 return products.map(p => {
//                         return {...p, quantity : this.cart.items.find(i => {
//                                 return i.productId.toString() === p._id.toString();
//                             }).quantity
//                         };
//                         })
//             }
//             else{
//                 return products;
//             }
//         })
//     }

//     deleteItemFromCart(productId){
//         const updatedCartItems = this.cart.items.filter(cart => {
//             return cart.productId.toString() !== productId.toString();
//         });
//         // const updatedCart = {items : updatedCartItems};
//         const db = getDb();
//         return db.collection('users').updateOne({_id : new ObjectId(this._id)},{$set : {cart : {items : updatedCartItems}}})
//     }

//     addOrder(){
//         const db = getDb();
//         return this.getCart()
//         .then(products => {
//             const order = {
//                 items : products,
//                 user : {
//                     _id : new ObjectId(this._id),
//                     name : this.name,
//                 }
//             }
//             return db.collection('orders').insertOne(order)
//         })
//         .then(result => {
//             this.cart = {items : []};
//             return db.collection('users').updateOne({_id : new ObjectId(this._id)},{$set : {cart : {items : []}}})
//         })
//         .catch(err => console.log(err))
//     }

//     getOrders(){
//         const db = getDb();
//         return db.collection('orders')
//         .find({'user._id' : new ObjectId(this._id)})
//         .toArray();

//     }

//     static findById(userId){
//         const db = getDb();
//         // return db.collection('usres').find({_id : new ObjectId(userId)})
//         // .next()
//         return db.collection('users').findOne({_id : new ObjectId(userId)})
//         .then(user => {
//             console.log(user);
//             return user;
//         })
//         .catch(err => console.log(err))
//     }
// }

// module.exports = User;
