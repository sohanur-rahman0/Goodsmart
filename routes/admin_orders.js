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


router.get('/change_status/:order_id', (req,res)=>{

    let id = req.params.order_id

    Orders.findById(id, (err, order)=>{
        if(err){
            console.log(err)
        } else {
            order.delivery_status = true;

            order.save((err)=>{
                if(err){
                    console.log(err)
                } else {
                    req.flash('success', 'Order status updated')
                    res.redirect('/admin/orders')
                }
            })
            
        }

        // req.flash('danger', 'Order not found')
        // res.redirect('/admin/dashboard')

    })
})




module.exports = router