const mysql = require('mysql2')

const pool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    database : 'node-complete',
    password : 'riyaa@2967'
});

module.exports = pool.promise()