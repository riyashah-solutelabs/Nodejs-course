const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  // console.log(req.get('Cookie').split(";")[1].trim().split('=')[1])
  // console.log(req.get('Cookie').trim().split('=')[1])
  // const isLoggedIn = req.get('Cookie').trim().split('=')[1] === 'true';
  console.log(req.session.isLoggedIn);
  // const isLoggedIn = req.session.isLoggedIn;
        res.render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          // isAuthenticated : isLoggedIn
          isAuthenticated : false
        })
  };
exports.postLogin = (req, res, next) => {
    // req.isLoggedIn = true;
    // res.setHeader('Set-Cookie', 'loggedIn=true;Max-Age=10')
    
    User.findById('641d58bd55705174f64d4cf0')
    .then(user => {
      console.log(user)
      req.session.isLoggedIn = true;
      req.session.user = user;
      // req.isLoggedIn = true;
      req.session.save((err) => {
        console.log(err)
        res.redirect('/')
      })
      // next();
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req,res,next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/')
  });
}  