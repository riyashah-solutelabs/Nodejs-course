const express = require('express');
const app = express();
const path = require('path');


app.set('view engine','ejs')
// console.log(path.join(__dirname,'views'));
app.set('views',path.join(__dirname,'views'))

const usersRoute = require('./routes/users');
const userListRoute = require('./routes/userList');
const bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({ extended: true}))
// app.use(usersRoute.route)
app.use(usersRoute)
app.use(userListRoute.route)


app.listen(3000, () => {
    console.log('Server listening on port 3000');
})