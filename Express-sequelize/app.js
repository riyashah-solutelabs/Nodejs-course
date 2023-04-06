// import { engine } from 'express-handlebars';
const { engine } = require('express-handlebars');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); 


const app = express();

app.set('view engine','ejs')
app.set('views','views')

const errorController = require('./controllers/error')
const sequelize = require('./util/database')
const Product = require('./modles/product')
const User = require('./modles/user')
const Cart = require('./modles/cart')
const CartItem = require('./modles/cart-item')
const Order = require('./modles/order')
const OrderItem = require('./modles/order-item')
const adminRoutes = require('./routes/admin')
// const adminData = require('./routes/admin')
const shopRoutes = require('./routes/shop')

// req.body ne parse krva
app.use(bodyParser.urlencoded({extended: false}));
// to use public folder files statically
app.use(express.static(path.join(__dirname,'public')))

app.use((req,res,next) => {
    User.findByPk(1)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err))
})

app.use('/admin',adminRoutes)
// app.use('/admin',adminData.routes)
app.use(shopRoutes)

app.use(errorController.get404)

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order)
Order.belongsToMany(Product, { through: OrderItem })

let start = async () => {
    try {
      await sequelize.sync();
      let user = await User.findByPk(1);
      if (!user) {
        user = await User.create({ name: 'Riya', email: 'riya@test.com' });
      }
      await user.createCart();
      app.listen(4000);
    } catch (err) {
      console.log(err);
    }
  }
  start();

// sequelize.sync({ force: true })
// sequelize.sync()
// .then(result => {
//     // console.log(result);
//     return User.findByPk(1)
// })
// .then((user) => {
//     if(!user){
//         return User.create({name: 'Max', email: 'test@test.com'})
//     }
//     // return Promise.resolve(user);
//     return user;
// })
// .then(user => {
//     // console.log(user);
//     return user.createCart()
// })
// .then(() => {
//     app.listen(4000)
// })
// .catch(err => {
//     console.log(err);
// })
