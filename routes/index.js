var express = require('express');
var router = express.Router();

var Product = require('../models/product')
var Cart = require('../models/cart')
var Order = require('../models/order')

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0]
  console.log(successMsg)
  Product.find({}, function(err, products){
    if(err) {
      console.log(err)
    } else {
      var productChunks = []
      var chunkSize = 3
      for(var i =0; i < products.length; i+=chunkSize){
        productChunks.push(products.slice(i, i+chunkSize))
      }
      res.render('index', {
        products: productChunks,
        successMsg: successMsg,
        noMessages: !successMsg
      });
    }
  })
});

router.get('/add-to-cart/:id', function(req, res, next){
  var productId = req.params.id
  var cart = new Cart(req.session.cart ? req.session.cart : {})

  Product.findById(productId, function(err, product){
    if (err) {
      return res.redirect('/')
    }
    cart.add(product, product.id)
    req.session.cart = cart
    res.redirect('/')
  })
})

// GET Cart Page
router.get('/cart', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('cart', { products: null })
  }
  var cart = new Cart(req.session.cart)
  res.render('cart', {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice
  })
});

// Get Checkout Page
router.get('/checkout', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart')
  }
  var cart = new Cart(req.session.cart)
  var errMsg = req.flash('error')[0]
  res.render('checkout', {
    total: cart.totalPrice,
    errMsg: errMsg,
    noErrors: !errMsg
  })
})

// Post Checkout Page
router.post('/checkout', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart')
  }
  var cart = new Cart(req.session.cart)
  var stripe = require("stripe")(
  "sk_test_UawoxUENSN7VkeeMIVKgmHMZ"
  );

  stripe.charges.create({
  amount: cart.totalPrice * 100,
  currency: "usd",
  source: req.body.stripeToken, // obtained with Stripe.js
  description: "Test Charge"
  }, function(err, charge) {
    if (err) {
      req.flash('error', err.messages)
      return res.redirect('/checkout')
    }
    var order = new Order({
      name: req.body.name,
      address: req.body.address,
      cart: cart,
      paymentId: charge.id
    })
    order.save(function(err, result){
      req.flash('success', 'Successfully bought product')
      req.session.cart = null
      res.redirect('/')
    })
  });
})

// Get Orders
router.get('/orders', function(req, res, next) {
  Order.find({}, function (err, orders){
    if(err){
      return res.write('Error!')
    }
    var cart;
    orders.forEach(function(order){
      cart = new Cart(order.cart)
      order.items = cart.generateArray()
    })
    console.log(orders)
    res.render('orders', {
      orders: orders
    })
  })
})

router.get('/cart/add/:id', function (req, res, next) {
  var productId = req.params.id
  var cart = new Cart(req.session.cart)

  Product.findById(productId, function(err, product){
    if (err) {
      return res.redirect('/')
    }
    cart.add(product, product.id)
    req.session.cart = cart
    res.redirect('/cart')
  })
})


router.get('/cart/reduce/:id', function (req, res, next) {
  var productId = req.params.id
  var cart = new Cart(req.session.cart)
  cart.reduceByOne(productId)
  req.session.cart = cart
  res.redirect('/cart')
})
module.exports = router;
