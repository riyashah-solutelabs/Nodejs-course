const mongodb = require('mongodb')
const getDb = require('../util/database').getDb;

class Product {
    constructor(title, price, description, imageUrl, id, userId){
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userId = userId ;
    }

    save(){
        const db = getDb();
        let dbOp;
        if(this._id){
            // update the product
            // dbOp = db.collection('products').updateOne({_id : new mongodb.ObjectId(this._id)}, {$set : this})
            // ahi new mongodb vadu na lkhie to b chale bcz aapde controller ma id moklti vkhte pan lkhyu 6
            dbOp = db.collection('products').updateOne({_id : this._id}, {$set : this})
        }else{
            //Insert new product
            // db.collection('products').insertOne({name : 'A book', price: 12.99})
            dbOp =  db.collection('products').insertOne(this)
            console.log("Insert");
        }
        return dbOp
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log(err))
    }

    static fetchAll(){
        const db = getDb();
        return db.collection('products').find()
        .toArray()
        .then(products => {
            console.log(products);
            return products;
        })
        .catch(err => console.log(err));
    }

    static findById(prodId){
        const db = getDb();
        return db.collection('products').find({_id : new mongodb.ObjectId(prodId)})
        // .toArray()
        .next()
        .then(product => {
            console.log(product);
            return product;
        })
        .catch(err => console.log(err))
    }

    static deleteById(prodId){
        const db = getDb();
        return db
        .collection('products')
        .deleteOne({ _id: new mongodb.ObjectId(prodId) })
        .then(result => {
          console.log('Deleted');
        })
        .catch(err => {
          console.log(err);
        });
    }
}
module.exports = Product;