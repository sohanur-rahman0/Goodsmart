const express = require('express')
const router = express.Router()
const mdkdirp = require('mkdirp')
const fs = require('fs-extra')
const mkdirp = require('mkdirp')
const resizeImg = require('resize-img')
const path = require('path')
const auth = require('../config/auth')
const isAdmin = auth.isAdmin;

const { check, validationResult } = require('express-validator')

//get product model

let Product = require('../models/product')
//get category model

let Category = require('../models/category')


//Get product index

router.get('/', isAdmin, (req, res) => {
    let count;
    Product.countDocuments((err, c) => {
        count = c
    })

    Product.find((err, products) => {
        res.render('admin/products', {
            products: products,
            count: count
        })
    })
})


//Get add products

router.get('/add-product', isAdmin, (req, res) => {
    let title = ""
    let desc = ""
    let price = ""


    Category.find((err, categories) => {
        res.render('admin/add_product', {
            title: title,
            desc: desc,
            price: price,
            categories: categories,
        })
    })
})



//post add products

router.post('/add-product', [
    check('title').isLength({ min: 1 }).withMessage('Title is Empty'),
    check('desc').isLength({ min: 1 }).withMessage('Description is empty'),
    check('price').isNumeric().withMessage('Price is Empty'),
    check('image').custom((value, { req }) => {
        let imageFile = req.files == null ? "" : req.files.image.name
        if (imageFile == "") {
            return true;
        }
        let ext = (path.extname(req.files.image.name).toLowerCase())
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            throw new Error('Only images are allowed')
        } else {
            return true;
        }
    })
], (req, res) => {

    let imageFile = req.files == null ? "" : req.files.image.name
    let desc = req.body.desc
    let category = req.body.category
    let price = req.body.price
    let title = req.body.title

    let slug = title.replace(/\s+/g, '-').toLowerCase()

    console.log(category)


    let errors = validationResult(req)

    if (errors.errors.length > 0) {
        let err = {}
        errors.errors.forEach((error) => {
            err[error.param] = error.msg
        })
        Category.find((err, categories) => {
            res.render('admin/add_product', {
                errors: err,
                title: title,
                desc: desc,
                price: price,
                categories: categories,
            })
        })
    } else {
        // console.log('success')
        Product.findOne({ slug: slug }, (err, product) => {
            if (product) {
                req.flash('danger', 'Product title exists, choose another.')
                Category.find((err, categories) => {
                    res.render('admin/add_product', {
                        title: title,
                        desc: desc,
                        price: price,
                        categories: categories,
                    })
                })
            } else {
                let price2 = parseFloat(price).toFixed(2)
                let product = new Product({
                    title: title,
                    slug: slug,
                    desc: desc,
                    price: price2,
                    category: category,
                    image: imageFile,
                })

                product.save((err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        mkdirp.sync('public/product_images/' + product._id)//,(err)=>{
                        //     console.log(err)
                        // })

                        mkdirp.sync('public/product_images/' + product._id + '/gallery')//,(err)=>{
                        //     console.log(err)
                        // })

                        mkdirp.sync('public/product_images/' + product._id + '/gallery/thumbs')//,(err)=>{
                        //     console.log(err)
                        // })

                        if (imageFile != "") {
                            let productImage = req.files.image
                            let path = 'public/product_images/' + product._id + '/' + imageFile;

                            productImage.mv(path, (err) => {
                                console.log(err)
                            })
                        }
                        req.flash('success', 'Product added!')
                        res.redirect('/admin/products')
                    }
                })
            }
        })
    }
})



//Get edit page

router.get('/edit-product/:id', isAdmin, (req, res) => {

    let errors = {
        errors: '',
    };
    if (req.session.errors) {
        errors = req.session.errors
    }
    req.session.errors = null

    Category.find((err, categories) => {

        Product.findById(req.params.id, (err, p) => {
            if (err) {
                console.log(err)
                res.redirect('/admin/products')
            } else {
                let gallleryDir = 'public/product_images/' + p._id + '/gallery'
                let galleryImages = null;

                fs.readdir(gallleryDir, (err, files) => {
                    if (err) {
                        console.log(err)
                    } else {
                        galleryImages = files;
                        //  console.log(galleryImages);
                        res.render('admin/edit_product', {
                            title: p.title,
                            errors: errors,
                            desc: p.desc,
                            price: parseFloat(p.price).toFixed(2),
                            categories: categories,
                            category: p.category.replace(/\s/g, '-').toLowerCase(),
                            image: p.image,
                            galleryImages: galleryImages,
                            id: p._id,
                        })
                    }
                })
            }
        })
    })
})



//post edit products

router.post('/edit-product/:id', [
    check('title').isLength({ min: 1 }).withMessage('Title is Empty'),
    check('desc').isLength({ min: 1 }).withMessage('Description is empty'),
    check('price').isNumeric().withMessage('Price is Empty'),
    check('image').custom((value, { req }) => {
        let imageFile = req.files == null ? "" : req.files.image.name

        if (imageFile == "") {
            return true;
        }
        let ext = (path.extname(req.files.image.name).toLowerCase())
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            throw new Error('Only images are allowed')
        } else {
            return true;
        }


    })
], (req, res) => {


    let imageFile = req.files == null ? "" : req.files.image.name
    let desc = req.body.desc
    let category = req.body.category
    let price = req.body.price
    let title = req.body.title
    let pimage = req.body.pimage
    let id = req.params.id

    let slug = title.replace(/\s+/g, '-').toLowerCase()


    let content = req.body.content

    let errors = validationResult(req)

    if (errors.errors.length > 0) {
        let err = {}
        errors.errors.forEach((error) => {
            err[error.param] = error.msg
        })
        req.session.errors = err
        res.redirect('admin/products/edit-product' + id)
    } else {
        Product.findOne({ slug: slug, _id: { '$ne': id } }, (err, p) => {
            if (err) {
                console.log(err)
            }

            if (p) {
                req.flash('danger', 'Product title exists, choose another.')
                res.redirect('/admin/products/edit-product' + id)
            } else {
                Product.findById(id, (err, p) => {
                    if (err) {
                        console.log(err)
                    }

                    p.title = title
                    p.slug = slug
                    p.desc = desc
                    p.price = price
                    p.category = category

                    if (imageFile != "") {
                        p.image = imageFile
                    }

                    p.save((err) => {
                        if (err) {
                            console.log(err)
                        }

                        if (imageFile != "") {
                            if (pimage != "") {
                                fs.remove('public/product_images/' + id + '/' + pimage, (err) => {
                                    if (err) {
                                        console.log(err)
                                    }
                                })
                            }

                            let productImage = req.files.image
                            let path = 'public/product_images/' + id + '/' + imageFile;

                            productImage.mv(path, (err) => {
                                console.log(err)
                            })
                        }

                        req.flash('success', 'Product edited!')
                        res.redirect('/admin/products/edit-product/' + id)

                    })
                })
            }
        })
    }

})



//post product gallery

router.post('/product-gallery/:id', (req, res) => {
    let productImage = req.files.file;
    let id = req.params.id;
    let path = 'public/product_images/' + id + '/gallery/' + req.files.file.name;
    let thumbsPath = 'public/product_images/' + id + '/gallery/thumbs/' + req.files.file.name;

    productImage.mv(path, (err) => {
        if (err) {
            console.log(err)
        } else {
            resizeImg(fs.readFileSync(path), { width: 100, height: 100 }).then((buf) => {
                fs.writeFileSync(thumbsPath, buf)
            })
        }
    })

    res.sendStatus(200)
})


//Get delete image

router.get('/delete-image/:image', isAdmin, (req, res) => {
    let originalImage = 'public/product_images/' + req.query.id + '/gallery/' + req.params.image;
    let thumbPath = 'public/product_images/' + req.query.id + '/gallery/thumbs/' + req.params.image;

    fs.remove(originalImage, (err) => {
        if (err) {
            console.log(err)
        } else {
            fs.remove(thumbPath, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    req.flash('success', 'Image Deleted')
                    res.redirect('/admin/products/edit-product/' + req.query.id)
                }
            })
        }
    })
})

//Get delete product

router.get('/delete-product/:id', isAdmin, (req, res) => {

    let id = req.params.id
    let path = 'public/product_images/' + id

    fs.remove(path, (err) => {
        if (err) {
            console.log(err)
        } else {
            Product.findByIdAndDelete(id, (err) => {
                if (err) {
                    console.log(err)
                }
            })

            req.flash('success', 'Product Deleted!')
            res.redirect('/admin/products/')

        }
    })
})


//exports
module.exports = router