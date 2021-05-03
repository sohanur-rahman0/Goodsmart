const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../config/auth')
const isUser = auth.isUser; 
//get Users model


let User = require('../models/user')

let Product = require('../models/product')

let Order = require('../models/order')


//get add product to cart

router.get('/add/:product', (req, res) => {

    let slug = req.params.product;


    Product.findOne({ slug: slug }, (err, p) => {
        if (err) {
            console.log(err)
        }

        if (typeof req.session.cart == "undefined") {
            req.session.cart = []

            req.session.cart.push({
                title: slug,
                qty: 1,
                price: parseFloat(p.price).toFixed(2),
                image: '/product_images/' + p._id + '/' + p.image,
            })
        } else {
            var cart = req.session.cart;

            var newItem = true;

            for (var i = 0; i < cart.length; i++) {
                if (cart[i].title == slug) {
                    cart[i].qty++;
                    newItem = false;
                    break
                }
            }

            if (newItem) {
                req.session.cart.push({
                    title: slug,
                    qty: 1,
                    price: p.price,
                    image: '/product_images/' + p._id + '/' + p.image,
                })
            }
        }

        // console.log(req.session.cart)
        req.flash('success', 'Product added')
        res.redirect('back')

    })

})


//get checkout page

router.get('/checkout', (req, res) => {
    // console.log(res.locals.user);
    res.render('checkout', {
        title: 'Checkout',
        cart: req.session.cart,
    })
})


//get update product

router.get('/update/:product', (req, res) => {

    let slug = req.params.product
    let cart = req.session.cart
    let action = req.query.action

    for (var i = 0; i < cart.length; i++) {
        if (cart[i].title == slug) {
            switch (action) {
                case "add":
                    cart[i].qty++
                    break

                case 'remove':
                    cart[i].qty--
                    if (cart[i].qty < 1) {
                        cart.splice(i, 1)
                    }
                    break
                case 'clear':
                    cart.splice(i, 1)
                    if (cart.length == 0) delete req.session.cart;
                    break;
                default:
                    console.log('update problem')
                    break
            }
            break;
        }
    }

    req.flash('success', 'Cart Updated')
    res.redirect('/cart/checkout')
})


//get clear cart

router.get('/clear', (req, res) => {
    delete req.session.cart;
    req.flash('success', 'Cart Cleared')
    res.redirect('/cart/checkout')

})


// router.get('/cart/bkash', (req,res)=>{
//     res.render('checkout', {
//         title: 'Checkout',
//         cart: req.session.cart,
//         user: res.locals.user,
//     })
// })



//post /bkash/payment
router.post('/bkash',
    [
        check('name').isLength({ min: 1 }).withMessage('Name must not be Empty'),
        check('phone').isLength({min: 11}).withMessage('Enter a valid phone number'),
        check('address').isLength({ min: 1 }).withMessage('Address must not be Empty'),
        check('trxID').isLength({ min: 10 }).withMessage('Please Input a valid TrxID')
    ]
    , (req, res) => {
        let user = res.locals.user
        let name = req.body.name
        let phone = req.body.phone
        let address = req.body.address
        let trxID = req.body.trxID
        let total_price = req.body.total_price
        let status = false

        // console.log(req.body)
        // console.log(res.locals.user)
        

        let errors = validationResult(req)

        if(errors.errors.length > 0){
            let err = {}
            errors.errors.forEach((error) => {
                err[error.param] = error.msg
            })
            res.render('checkout', {
                title: 'checkout',
                errors: err,

            })
        } else {

            let order = new Order( {
                name: name,
                username: user.username,
                phone: phone,
                address: address,
                trxID: trxID,
                delivery_status: status,
                order: req.session.cart,
                total_price: total_price
            })

            order.save((err)=>{
                if (err) {
                    console.log(err)
                } else {
                    req.flash('success', 'Your order is placed');
                    delete req.session.cart;
                    res.redirect('/cart/checkout')
                }
                
            })
            // res.locals.user
        
        }


    })


//end

//post /cash/payment
router.post('/cash',
    [
        check('name').isLength({ min: 1 }).withMessage('Name must not be Empty'),
        check('phone').isLength({min: 11}).withMessage('Enter a valid phone number'),
        check('address').isLength({ min: 1 }).withMessage('Address must not be Empty'),
    ]
    , (req, res) => {
        let user = res.locals.user
        let name = req.body.name
        let phone = req.body.phone
        let address = req.body.address
        let total_price = req.body.total_price
        let status = false

        // console.log(req.body)
        // console.log(res.locals.user)
        

        let errors = validationResult(req)

        if(errors.errors.length > 0){
            let err = {}
            errors.errors.forEach((error) => {
                err[error.param] = error.msg
            })
            res.render('checkout', {
                title: 'checkout',
                errors: err,

            })
        } else {

            let order = new Order( {
                name: name,
                username: user.username,
                phone: phone,
                address: address,
                delivery_status: status,
                order: req.session.cart,
                total_price: total_price
            })

            order.save((err)=>{
                if (err) {
                    console.log(err)
                } else {
                    req.flash('success', 'Your order is placed');
                    delete req.session.cart;
                    res.redirect('/cart/checkout')
                }
                
            })
            // res.locals.user
        
        }


    })

//end


//exports
module.exports = router