const path = require('path');
// const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const { v4 : uuidv4 } = require('uuid');

const { graphqlHTTP } = require('express-graphql');
// const graphqlHttp = require('express-graphql').graphqlHttp
// const { createHandler } = require("graphql-http")
// const { createHandler } = require("graphql-http/lib/use/express")

const graphqlSchema = require('./graphql/schema')
const graphqlResolver = require('./graphql/resolvers')

const auth = require('./middleware/auth')
const { clearImage } = require('./util/file')

var today = new Date();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
console.log("today : ",today)
console.log("today : ",time)
const app = express();

// console.log("date :",new Date().toLocaleTimeString())
const fileStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        // cb(null, 'Backend/images');
        cb(null, 'images');
    },
    filename: function(req, file, cb) {
        cb(null, uuidv4() + '-'+ file.originalname)
    }
});

const fileFilter = (req,file,cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null,true)
    }else{
        cb(null,false)
    }
}

const imagePath = path.join(__dirname,'images')
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); //application/json
app.use(multer({
    storage : fileStorage,
    fileFilter : fileFilter
}).single('image'))
app.use('/images',express.static(imagePath))

app.use((req,res,next) => {
    // res.setHeader('Access-Control-Allow-Origin','codepan.io')
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST, PUT, PATCH, DELETE');
    // res.setHeader('Access-Control-Allow-Headers','*');
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');

    if(req.method === 'OPTIONS'){
        return res.sendStatus(200)
    }
    next();
});

app.use(auth);

app.put('/post-image', (req,res,next) => {
    if(!req.isAuth){
        throw new Error('Not Authenticated')
    }
    if(!req.file){
        return res.status(200).json({
            message: 'No file provided!'
        })
    }
    console.log("old ",req.body.oldPath)
    // oldPath was passed with incoming request
    if(req.body.oldPath){
        // delete the old image
        clearImage(req.body.oldPath)
    }
    // req.file.path - this is the path multer will store and we use in backend
    return res.status(201).json({message : 'File Stored!',filePath : req.file.path})
})

app.use('/graphql', 
    graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql : true,
    // formatError(err) {
        customFormatErrorFn(err) {
        // return err;
        if(!err.originalError){
            return err;
        }
        const data = err.originalError.data;
        const message = err.message || 'An error occured';
        const code = err.originalError.code || 500;
        return { message : message , status: code, data: data}
    }
}));
// app.use('/graphql', 
//     createHandler({
//     schema: graphqlSchema,
//     rootValue: graphqlResolver,
//     graphiql : true
// }));

app.use((error,req,res,next) => {
    // console.log(error)
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message : message,
        data : data
    })
})

mongoose.connect('mongodb+srv://riyaashah402:wMB0h5E6y2jErofF@cluster0.sdwkice.mongodb.net/messagesGraphql')
.then(result => {
    console.log("Connected")
    app.listen(4500 , () => {
        console.log("Server is connected on port 4500..")
    });
})
.catch(err => {
    console.log(err)
})

// const clearImage = filePath => {
//     // filePath = path.join(filePath);
//     // filePath = path.join(__dirname, '..',filePath);
//     // console.log("filePath : ",filePath)
//     fs.unlink(filePath, err => console.log(err))
//   }