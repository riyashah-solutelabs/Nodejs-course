const express = require('express');
const route = express.Router();
// const path = require('path')
// const user = require('./users')
const usersController = require('../controller/users')
// const rootDir = require('../util/path')

route.get('/users', usersController.getUsers)

exports.route = route;