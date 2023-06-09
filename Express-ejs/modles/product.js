const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

// const products = []

const p = path.join(path.dirname(process.mainModule.filename),'data','products.json');
const getProductsFromFile = (cb) => {
        fs.readFile(p, (err, fileContent) => {
            if(err){
                // return [];
                // return cb([])
                cb([])
            }else{

                // return JSON.parse(fileContent)
                cb(JSON.parse(fileContent))
            }
        })
}

module.exports = class Product{
    constructor(id,title, imageUrl, price, description){
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }

    save(){
        // products.push(this)
        getProductsFromFile(products => {
            if(this.id){
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products]
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts) , (err) => {
                    console.log(err);
                })
            }else{
                this.id = Math.random().toString();
                products.push(this);
                // console.log("p1 ",products);
                fs.writeFile(p, JSON.stringify(products) , (err) => {
                    console.log(err);
                })
            }
        })
        // const p = path.join(path.dirname(process.mainModule.filename),'data','products.json');

        // fs.readFile(p, (err, fileContent) => {
            // let products = [];
            // if(!err){
            //     // fetch previous products
            //     products = JSON.parse(fileContent)
            // }
            // console.log("p ",products);
           
        // })
    }

    static deleteById(id){
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            const updatedProducts = products.filter(prod => prod.id !== id);
           fs.writeFile(p, JSON.stringify(updatedProducts) , (err) => {
                if(!err){
                    Cart.deleteProduct(id, product.price);
                }
           });
        });
    }

    static fetchAll(cb){
        // return products;
        getProductsFromFile(cb);
    }

    static findById(id, cb){
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            // console.log(product);
            cb(product)
        })
    }

}