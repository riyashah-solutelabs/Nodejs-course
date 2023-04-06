const fs = require('fs');
const path = require('path');

// const users = [];
console.log(path.dirname(process.mainModule.filename));
const p = path.join(path.dirname(process.mainModule.filename),'data','users.json')
const getUsersFromFile = (cb) => {
    fs.readFile(p, (err,userData) => {
        if(err){
            cb([]);
        }else{
            cb(JSON.parse(userData));
        }
    })
}
module.exports = class User{
    constructor(name){
        this.name = name;
    }
    // save(){
    //     users.push(this);
    // }
    // static fetchAll(){
    //     return users;
    // }

    //to store and fetch data to and from file 
    save(){
        // users.push(this);
        console.log("Save");
        getUsersFromFile(users => {
            users.push(this);
            fs.writeFile(p, JSON.stringify(users), (err)  => {
                console.log(err);
            })
        })
        
    }
    static fetchAll(cb){
        // return users;
        console.log("Fetching users");
        getUsersFromFile(cb);
    }
}