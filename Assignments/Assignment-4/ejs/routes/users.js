const express = require('express');
const route = express.Router();
const path = require('path')

const usersController = require('../controller/users')

// const users = [];

// const rootDir = require('../util/path')
route.get('/', usersController.getAddUsers)
route.post('/', usersController.postAddUsers)


module.exports = route;
// exports.route = route;
// exports.users = users;