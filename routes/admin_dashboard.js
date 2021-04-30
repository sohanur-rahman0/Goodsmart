const express = require('express')

const router = express.Router()

const auth = require('../config/auth')
const isAdmin = auth.isAdmin;

// const { check, validationResult } = require('express-validator')

//get order model

// let Orders = require('../models/order')


router.get('/', (req, res) => {
    res.render('dashboard')
})

module.exports = router