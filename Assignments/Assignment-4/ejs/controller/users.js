// const users = [];

const User = require('../model/user')

exports.getAddUsers = (req,res,next) => {
    // res.sendFile(path.join(rootDir,'views','users.html'));
    res.render('users',{pageTitle : 'Add Users' , activePath : '/'});
}

exports.postAddUsers = (req,res,next) => {
    console.log(req.body.name);
    const users = new User(req.body.name);
    users.save()
    // users.push({name:req.body.name})
    res.redirect('/users')
}

exports.getUsers = (req,res,next) => {
    // console.log(user.users[0].name);
    // res.sendFile(path.join(rootDir,'views','usersList.html'))
    // res.render('usersList', { pageTitle : 'Users', users : user.users , activePath : '/users'})
    User.fetchAll(users => {
        res.render('usersList', { pageTitle : 'Users', users : users , activePath : '/users'})
    });
}