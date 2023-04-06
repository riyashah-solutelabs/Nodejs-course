const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://riyaashah402:wMB0h5E6y2jErofF@cluster0.sdwkice.mongodb.net/shop?retryWrites=true&w=majority') // new/shop - to connect to shop database
    .then(client => {
        console.log('Connected');
        // callback(client)
        // _db = client.db('test') //to overwrite different db
        // _db use kyu so that connection continue rahe vare ghdiye connection krvani jarurt na pde
        _db = client.db()
        callback()
    })
    .catch(err => {
        console.log(err)
        throw err;
    })
};

// return access to that connected _db if it exists
const getDb = () => {
    if(_db) {
        return _db;
    }
    throw 'No database found!'
}

// module.exports = mongoConnect;

// connecting and storing connection to _db and therefore db keep on running
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

// mongodb manages this behind the scean very elegentlty with somenthing called connection pooling where mongodb make sure it provide sufficient connection for multiple symulteneous interactions with the db