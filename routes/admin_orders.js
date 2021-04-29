const express = require('express')

const router = express.Router()

const auth = require('../config/auth')
const isAdmin = auth.isAdmin;

const { check, validationResult } = require('express-validator')

//get order model

let Orders = require('../models/order')


router.get('/', (req,res)=>{

    let count;
    Orders.countDocuments((err,c)=>{
        count = c
    })

    Orders.find((err,data)=>{
        if(err) {
            console.log(err)
        } else {
            res.render('admin/orders', {
                count: count,
                orders: data
            })
        }
    })
})




module.exports = router