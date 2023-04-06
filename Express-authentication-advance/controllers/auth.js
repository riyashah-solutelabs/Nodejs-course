const crypto = require('crypto')
const moment = require('moment-timezone');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    // api_user :
    // api_key :
    api_key : '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'
  }
}))

exports.getLogin = (req, res, next) => {
  let message = req.flash('error')
  if(message.length > 0){
    message = message[0]
  }else{
    message = null
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    // errorMessage : req.flash('error')
    errorMessage : message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error')
  if(message.length > 0){
    message = message[0]
  }else{
    message = null
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage : message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email : email})
    .then(user => {
      if(!user){
        req.flash('error','Invalid email or password')
        return res.redirect('/login')
      }
      bcrypt.compare(password, user.password)
      .then(doMatch => {
        if(doMatch){
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err => {
            console.log(err);
            return res.redirect('/')
          });
        }
        req.flash('error','Invalid email or password')
        res.redirect('/login')
      })
      .catch(err => {
          console.log(err);
          res.redirect('/login')
      })
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmpassword = req.body.confirmpassword;
  User.findOne({email : email})
  .then(userDoc => {
      if(userDoc){
        req.flash('error','E-mail Exists Already! Please pick a different one.')
        return res.redirect('/signup')
      }
      return bcrypt.hash(password, 12)
      .then(hashedPassword => {
        const user = new User({
          email : email,
          password : hashedPassword,
          cart : { items : []}
        });
        return user.save();
      })
      .then((result) => {
        res.redirect('/login')
        return transporter.sendMail({
          to: email,
          // from : 'shop@node-complete.com',
          from : 'riyaashah402@gmail.com',
          subject: 'Signup successful',
          html : "<h1>You Successfully signed up!</h1>"
        })
        // .then(result => {
        //   res.redirect('/login')
        // })
      })
      .catch(err => {
        console.log(err);
      })
  })
  .catch(err => {
    console.log(err);
  })
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req,res,next) => {
  let message = req.flash('error')
  if(message.length > 0){
    message = message[0]
  }else{
    message = null
  }
  res.render('auth/reset', {
    path:'/reset',
    pageTitle: 'Reset Password',
    errorMessage : message
  })
}

exports.postReset = (req,res,next) => {
  crypto.randomBytes(32, (err,buffer) => {
    if(err){
      console.log(err)
      req.flash('error','Error Occured');
      return res.redirect('/reset')
    }
    const token = buffer.toString('hex');
    User.findOne({email:req.body.email})
    .then(user => {
      if(!user){
        req.flash('error','No Account With that Email Found.')
        return res.redirect('/reset')
      }
        user.resetToken = token;
        console.log(token)
        // let date = Date.now() + 3600000;
        // let dateUTC = (moment.tz(date, "UTC"));
        // let dateIndia = dateUTC.tz("Asia/Kolkata").format()
        // console.log(dateIndia)
        user.resetTokenExpiration = Date.now() + 3600000;
        // user.resetTokenExpiration  = moment(user.resetTokenExpiration).tz("Asia/Kolkata").format()
        // const myDate = moment.utc(user.resetTokenExpiration).tz('Asia/Kolkata').format()
        // console.log(myDate)
        return user.save();
    })
    .then(result => {
      res.redirect('/')
      transporter.sendMail({
        to: req.body.email,
        // from : 'shop@node-complete.com',
        from : 'riyaashah402@gmail.com',
        subject: 'Password Reset',
        html : `
          <p>You requested a Password Reset</p>
          <p>Click this <a href="http://localhost:4000/reset/${token}"> link </a> to set a new password/</p>
        `
      })
    })
    .catch(err => {
      console.log(err)
    })
  })
}

exports.getNewPassword = (req,res,next) => {
  // reterivw token from url
  const token = req.params.token;
  // let date = Date.now();
  // let dateUTC = (moment.tz(date, "UTC"));
  // let dateIndia = dateUTC.tz("Asia/Kolkata").format()
  // User.findOne({resetToken: token, resetTokenExpiration: {$gt: dateIndia}})
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
  .then(user => {
    if(!user){
      return  res.render('auth/reset', {
        path:'/reset',
        pageTitle: 'Reset Password',
        errorMessage : 'Please Submit Request Again',
      })
    }
    let message = req.flash('error')
    if(message.length > 0){
      message = message[0]
    }else{
      message = null
    }
    res.render('auth/new-password', {
      path:'/new-password',
      pageTitle: 'New Password',
      errorMessage : message,
      // we add userId so that we can find user jeno pw change krvo 6 aa userId new-password.ejs ma pass thse
      userId : user._id.toString(),
      passwordToken : token
    })
  })
  .catch(err => {
    console.log(err)
  })
}

exports.postNewPassword = (req,res,next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  console.log(passwordToken)
  let resetUser; //bcz aapde multiple jgyae user variable use krvu 6
  // let date = Date.now();
  // let dateUTC = (moment.tz(date, "UTC"));
  // let dateIndia = dateUTC.tz("Asia/Kolkata").format()
  User.findOne({
    resetToken: passwordToken, 
    // resetTokenExpiration: {$gt: dateIndia},
    resetTokenExpiration: {$gt: Date.now()},
    _id: userId
  })
  .then(user => {
    console.log(user)
    resetUser = user;
    return bcrypt.hash(newPassword, 12);
  })
  .then(hashedPassword => {
    console.log(resetUser)
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    return resetUser.save()
  })
  .then(result => {
    res.redirect('/login');
  })
  .catch(err => {
    console.log(err)
  })
}