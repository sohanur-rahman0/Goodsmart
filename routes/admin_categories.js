const express = require('express')

const router = express.Router()

const auth = require('../config/auth')
const isAdmin = auth.isAdmin;

const { check, validationResult } = require('express-validator')

//get category model

let Category = require('../models/category')


//Get category index

router.get('/',isAdmin,(req, res) => {

    Category.find((err, categories) => {
        if (err) {
            console.log(err)
        } else {
            res.render('admin/categories', {
                categories: categories
            })
        }
    })

})


//Get add category page

router.get('/add-category',isAdmin, (req, res) => {
    let title = ""

    res.render('admin/add_category', {
        title: title,
    })
})


// post category 

router.post('/add-category',isAdmin, [check('title').isLength({ min: 1 }).withMessage('Title is Empty')], (req, res) => {


    let title = req.body.title

    let slug = title.replace(/\s+/g, '-').toLowerCase()

    let errors = validationResult(req)

    if (errors.errors.length > 0) {
        console.log('errors')
        res.render('admin/add_category', {
            errors: errors,
            title: title,
        })
    } else {
        console.log('success')
        Category.findOne({ slug: slug }, (err, category) => {
            if (category) {
                req.flash('danger', 'Category title exists, choose another.')
                res.render('admin/add_category', {
                    title: title,
                })
            } else {
                let category = new Category({
                    title: title,
                    slug: slug,

                })

                category.save((err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        //get all the category to pass at header ejs
                        Category.find((err, categories) => {
                            if (err) {
                                console.log(err)
                            } else {
                                req.app.locals.categories = categories
                            }
                        })

                        req.flash('success', 'Category added!')
                        res.redirect('/admin/categories')
                    }
                })
            }
        })
    }


})

//post reorder pages
// router.post('/reorder-pages', (req, res)=>{
//     let ids = req.body.['id[]'];

//     let count = 0;

//     for (let i=0; i<ids.length; i++){
//         let id = ids[i];
//         count ++;

//         (function(count){
//             Page.findById(id, (err,page)=>{
//                 page.sorting = count;
//                 page.save((err)=>{
//                     if(err){
//                         console.log(err);
//                     }
//                 })
//             })
//         })(count)


//     }
// }) 

//Get edit category

router.get('/edit-category/:id',isAdmin,(req, res) => {
    Category.findById(req.params.id, (err, category) => {
        if (err) {
            console.log(err)
        } else {
            res.render('admin/edit_category', {
                title: category.title,
                id: category._id
            })
        }
    })
})



//post edit category

router.post('/edit-category/:id',isAdmin, [check('title').isLength({ min: 1 }).withMessage('Title is Empty')], (req, res) => {


    let title = req.body.title

    let slug = title.replace(/\s+/g, '-').toLowerCase()

    let id = req.params.id

    let errors = validationResult(req)

    if (errors.errors.length > 0) {
        console.log('errors')
        res.render('admin/edit_category', {
            errors: errors,
            title: title,
            id: id
        })
    } else {
        console.log('success')
        Category.findOne({ slug: slug, _id: { '$ne': id } }, (err, category) => {
            if (category) {
                req.flash('danger', 'Category title exists, choose another.')
                res.render('admin/edit_category', {
                    title: title,
                    id: id
                })
            } else {
                Category.findById(id, (err, category) => {
                    if (err) {
                        console.log(err)
                    } else {
                        category.title = title;
                        category.slug = slug;

                        category.save((err) => {
                            if (err) {
                                console.log(err)
                            } else {
                                //get all the category to pass at header ejs
                                Category.find((err, categories) => {
                                    if (err) {
                                        console.log(err)
                                    } else {
                                        req.app.locals.categories = categories
                                    }
                                })

                                req.flash('success', 'Category Edited!')
                                res.redirect('/admin/categories/edit-category/' + id)
                            }
                        })
                    }
                })


            }
        })
    }


})

//Get delete category

router.get('/delete-category/:id',isAdmin, (req, res) => {
    Category.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            console.log(err)
        } else {
            //get all the category to pass at header ejs
            Category.find((err, categories) => {
                if (err) {
                    console.log(err)
                } else {
                    req.app.locals.categories = categories
                }
            })

            req.flash('success', 'Category Deleted!')
            res.redirect('/admin/categories/')
        }
    })
})


//exports
module.exports = router