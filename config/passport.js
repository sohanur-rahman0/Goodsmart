const LocalStrategy = require('passport-local').Strategy

const bcrypt = require('bcryptjs')

const { createActivity } = require('../handlers/activityHandler')

let User = require('../models/user')

module.exports = (passport) => {
    passport.use(new LocalStrategy((username, password, done) => {
        User.findOne({ username: username }, (err, user) => {
            if (err) {
                console.log(err)
            }

            if (!user) {
                createActivity(username, 'login', 'failed login! username does not exist');
                return done(null, false, { message: "No user found with that username." })
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.log(err)
                }

                if (isMatch) {
                    createActivity(username, 'login', 'successfully logged in');
                    return done(null, user)
                } else {
                    createActivity(username, 'login', 'failed login! Incorrect password');
                    return done(null, false, { message: "Incorrect password" })
                }
            })
        })
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}