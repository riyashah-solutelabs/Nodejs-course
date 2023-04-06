const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const usersRoute = require('./route/users')
const listRoute = require('./route/listusers')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('public'))

app.use('/users',usersRoute)
app.use(listRoute)

app.listen(3000);