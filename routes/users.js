const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
//get Users model
let User = require('../models/user')
let { createActivity } = require('../handlers/activityHandler')


//get register page

router.get('/register', (req, res) => {
    res.render('register', {
        title: "Register",
    })

})


//post  register page

router.post('/register',
    [
        check('email').isLength({ min: 1 }).withMessage('Email is required').isEmail().withMessage('Enter a valid email'),
        check('username').isLength({ min: 5 }).withMessage('Username is required'),
        check('phone').isLength({ min: 11 }).withMessage('A valid Phone number is required'),
        check('password').isLength({ min: 8 }).withMessage('Password is required and should be 8 or more character'),
        check('confirm_password').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Confirmation password is incorrect')
            } else {
                return true
            }

        }),
    ], (req, res) => {


        let email = req.body.email
        let username = req.body.username
        let password = req.body.password
        let password2 = req.body.password2
        let phone = req.body.phone

        let errors = validationResult(req)

        if (errors.errors.length > 0) {
            let err = {}
            errors.errors.forEach((error) => {
                err[error.param] = error.msg
            })

            res.render('register', {
                title: "Register",
                errors: err,
                user: null,
            })
        } else {
            User.findOne({ username: username }, (err, user) => {
                if (err) {
                    console.log(err)
                }

                if (user) {
                    req.flash('danger', 'Username already exists, choose another')
                    res.redirect('/users/register')
                } else {
                    let user = new User({

                        email: email,
                        username: username,

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

                            user.save((err, user) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    createActivity(user.username, 'register', `New user created with username: ${user.username}`)
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

router.get('/logout', (req, res) => {
    let id = req.session.passport.user
    User.findById(id)
    .then(user=>{
        createActivity(user.username, 'logout', `username: ${user.username} logged out`)
    })
    .catch(err => console.log(err))

    req.logout()
    req.flash('success', 'You are logged out')
    res.redirect('/users/login')
})



//exports
module.exports = router