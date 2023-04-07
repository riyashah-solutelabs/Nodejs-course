const express = require('express');
// const { check } = require('express-validator/check')
const { check, body } = require('express-validator')

const authController = require('../controllers/auth');
const User = require('../models/user')

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', 
body('email').isEmail()
.withMessage('Please Enter Valid Email')
// .custom((value,{req}) => {
//     return User.findOne({email : value})
//     .then(user => {
//       if(!user){
//         return Promise.reject('Invalid email or password')
//       }
//     })
// })
.normalizeEmail()
,
body('password', "Password has to be valid.")
.isLength({min:5})
.isAlphanumeric()
.trim()
,authController.postLogin);

router.post('/signup', 
    [
        check('email').isEmail()
        .withMessage('Please Enter a valid Email.')
        .custom((value,{ req }) => {
            return User.findOne({email : value})
            .then(userDoc => {
                if(userDoc){
                    return Promise.reject('E-mail Exists Already! Please pick a different one.')
                }
            })
        })
        .normalizeEmail()
        ,
        body('password','Please Enter Password with only number and Text and atleast 5 characters').isLength({min: 5})
        .isAlphanumeric()
        .trim()
        ,
        body('confirmPassword')
        .trim()
        .custom((value, {req}) => {
            if(value !== req.body.password){
                throw new Error("Password Dosen't Match!")
            }
            return true;
        })

    ],
        authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);
module.exports = router;