const express = require('express');
const app = express();
const path = require('path');

const usersRoute = require('./routes/users');
const userListRoute = require('./routes/userList');
const bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({ extended: true}))
app.use(usersRoute.route)
app.use(userListRoute.route)

app.set('view engine', 'pug');
app.set('views',path.join(__dirname,'views'))
// app.set('views','views')

app.listen(3000, () => {
    console.log('Server listening on port 3000');
})