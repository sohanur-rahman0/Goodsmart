const express = require('express')
const router = express.Router()
const fs = require('fs-extra')
const auth = require('../config/auth')
const isUser = auth.isUser;
//Get Product model
let Product = require('../models/product')

//Get category model
let Category = require('../models/category');



//get all product

router.get('/', (req, res) => {
    // req.app.locals.UserName = req.body.username
    
    Category.find((err,c)=>{
        Product.find((err, products) => {
            if (err) {
                console.log(err)
            }
            
            res.render('all_products', {
                title: "Welcome to Goodsmart",
                products: products,
                categories: c
            })
    
        })
    })
    

})



//get all products by category

router.get('/products/:category', (req, res) => {

    let categorySlug = req.params.category;
    //console.log(categorySlug)
    Category.find({slug: categorySlug }, (err, c) => {
        Product.find({category: categorySlug}, (err,products)=>{
            if (err) {
                console.log(err)
            }
            // console.log(c)
            //console.log(res.app.locals.categories)
    
            res.render('cat_products', {
                // title: c.title,
                title: "Category Products",
                products: products,
                categories: res.app.locals.categories,
                
            })
    
        })
        
    })

})


//get product details

router.get('/products/:category/:product', (req, res) => {

    //let galleryImages = null;

    let loggedIn = (req.isAuthenticated()) ? true : false

// console.log(req.params.product)

    Product.findOne({slug: req.params.product}, (err,product)=>{
        // console.log(product)
        if(err){
            console.log(err)
        } else {
            // let galleryDir = 'public/product_images/' + product._id + '/gallery';
            // fs.readdir(galleryDir, (err, files)=>{
                //  if(err){
                    //  console.log(err)
                //  } else {
                    //  galleryImages = files;
                    // console.log(product)
                     res.render('product', {
                        // title: product.title,
                        title: "Product Description",
                         p: product,
                        //  galleryImages: galleryImages,
                         loggedIn: loggedIn,
                     })
                //  }
            // })
        }
    })

})


//search

router.get('/search', (req,res)=>{
    let q = req.query["term"]
    // console.log('autocomplete request')
    Product.find({title: {$regex: new RegExp(q), $options: "i"}}, (err,data)=>{
        if (err){
            console.log(err)
        } else {
          let arr = {}
          data.forEach(el => {
            arr[el.title]="http://"+ req.headers.host+"/product_images/"+el._id+"/"+el.image
          })
        //   console.log(arr)
          res.json(arr)
        }
    }).limit(5)  
  })


/// search result

router.post('/search', (req, res)=>{
    let searchvalue = req.body.searchbox
    let loggedIn = (req.isAuthenticated()) ? true : false
    Product.find({title: searchvalue}, (err, data)=>{
        
        if(err){
            console.log(err)
        } else if(data.length ==0){
                req.flash('danger', 'No product found with that name')
                res.redirect('/')
        }
         else {
            res.render('product', {
                title: "Search Result",
                p: data[0],
                loggedIn: loggedIn,
            })
        }
    })
})

//exports
module.exports = router