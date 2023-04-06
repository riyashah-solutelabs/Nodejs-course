const express = require('express');
const app = express();

// app.use((req,res,next) => {
//     console.log("I'M First Middleware");
//     next();
// })
// app.use((req,res,next) => {
//     console.log("I'M Second Middleware");
//     res.send('<h1> Home Page </h1>')
// })
// app.use('/',(req,res,next) => {
//     console.log('Middleware');
//     next();
// })

app.use('/users',(req,res,next) => {
    console.log(req.url)
    console.log('Another Middleware');
    res.send('<h1> Users Page </h1>')
})

app.use('/',(req,res,next) => {
    console.log("h "+req.url)
    console.log("I'M First Middleware");
    res.send('<h1> Home Page </h1>')
    // next();
})
app.listen(2000)