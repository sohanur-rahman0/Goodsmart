const express = require('express')

const router = express.Router()

const auth = require('../config/auth')
const isAdmin = auth.isAdmin
const User = require('../models/user')
const Product = require('../models/product')
const Order = require('../models/order')
const Category = require('../models/category')

// const { check, validationResult } = require('express-validator')

//get order model

// let Orders = require('../models/order')

router.get('/', isAdmin, async (req, res) => {
  const userCount = await User.count()
  const productCount = await Product.count()
  const orderCount = await Order.count()
  const categoryCount = await Category.count()
  res.render('admin/dashboard', { userCount, productCount, orderCount, categoryCount })
})

module.exports = router
