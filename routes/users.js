const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
//get Users model
let User = require('../models/user')


//get register page

router.get('/register', (req, res) => {
    res.render('register', {
        title: "Register",
    })

})


//post  register page

router.post('/register',
    [
        check('name').isLength({ min: 1 }).withMessage('Name is required'),
        check('email').isEmail().withMessage('Email is required'),
        check('username').isLength({ min: 1 }).withMessage('Username is required'),
        check('address').isLength({min: 1}).withMessage('Address is required for home delivery'),
        check('phone').isLength({min: 11}).withMessage('Phone number is required'),
        check('password').isLength({ min: 5 }).withMessage('Password is required and should be more than 5 character'),
        check('password2').custom((value, { req }) => {
            // console.log(value)
            // console.log(req.body.password2)
            if (value !== req.body.password) {
                throw new Error('Confirmation password is incorrect')
            } else {
                return true
            }

        }),
    ], (req, res) => {

        let name = req.body.name;
        let email = req.body.email
        let username = req.body.username
        let password = req.body.password
        let password2 = req.body.password2
        let address = req.body.address
        let phone = req.body.phone

        let errors = validationResult(req)

        if (errors.errors.length > 0) {
            res.render('register', {
                title: "Register",
                errors: errors,
                user: null,
            })
        } else {
            User.findOne({ username: username }, (err, user) => {
                if (err) {
                    console.log(err)
                }

                if (user) {
                    req.flash('danger', 'Username exists, choose another')
                    res.redirect('/users/register')
                } else {
                    let user = new User({
                        name: name,
                        email: email,
                        username: username,
                        address: address,
                        phone: phone,
                        password: password,
                        admin: 0
                    })

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(user.password, salt, (err, hash) => {
                            if (err) {
                                console.log(err)
                            }

                            user.password = hash

                            user.save((err) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    req.flash('success', 'You are registered Now.')
                                    res.redirect('/')
                                }
                            })
                        })
                    })

                    //user.save()
                }



            })
        }



    })

//get login page

router.get('/login', (req, res) => {

    if (res.locals.user) {
        res.redirect('/');
    }
    res.render('login', {
        title: "Login",
    })

})

//post login page

router.post('/login', (req, res, next) => {

    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true,
    })(req, res, next)
})


//get log out

router.get('/logout', (req, res)=>{
    req.logout()
    req.flash('success', 'You are logged out')
    res.redirect('/users/login')
})



//exports
module.exports = router