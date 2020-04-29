var express = require('express');
var router = express.Router();
const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);


var Cart= require("../models/cart");
var Product= require('../models/product');
var Order= require('../models/order');


/* GET home page. */
router.get('/', function(req, res, next) {
  
  var successMsg = req.flash("success")[0];
  
 Product.find(function(err,docs){
   
  var productChunks =[];
   var chunkSize = 3;
   for (var i=0 ; i < docs.length ;i += chunkSize){
      productChunks.push(docs.slice(i,i + chunkSize));
      }
      
  res.render('shop/index', { 
    
    title: 'Shopping Cart' , 
    products : productChunks ,
  successMsg:successMsg , noMessage: !successMsg});
 });
  });

router.get("/add-to-cart/:id",function(req,res,next){
  var productId=req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId , function(err,product){
    if(err){
      return res.redirect("/");
    }
    cart.add(product,product.id);
    req.session.cart=cart;
    console.log(req.session.cart);
    res.redirect("/");
    
  });
});
router.get("/reduce/:id" , function(req,res,next){
  var productId=req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
})
router.get("/remove/:id" , function(req,res,next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
})
router.get("/shopping-cart",function(req,res,next){
  if(!req.session.cart){
    return res.render("shop/shopping-cart" , {products: null});
  }
  var cart=new Cart(req.session.cart);
  res.render("shop/shopping-cart",{products: cart.generateArray(), totalPrice:cart.totalPrice})
});
router.get("/checkout",isLoggedIn,function(req,res,next){
  if(!req.session.cart){
    return res.redirect("/shopping-cart");
  }
  var cart=new Cart(req.session.cart);
  var errMsg=req.flash("error")[0];
  res.render("shop/checkout",{ stripePublishableKey: keys.stripePublishableKey, total: cart.totalPrice , errMsg:errMsg , noError : !errMsg});
})

// router.post("/checkout" , function(req,res,next){
//   if(!req.session.cart){
//     return res.redirect("/shopping-cart");
//   }
//   var cart=new Cart(req.session.cart);
  

//   var stripe=require("stripe")("sk_test_UFzSrj0WMwU52XJEEr3Q1RBx00Fm1DryBl");
//   console.log( req.body.stripeToken)
//   stripe.charges.create({
//     amount: cart.totalPrice * 100,
//     source: req.body.stripeToken,
//     currency: 'INR'
//   } , function(err,charges){
//     if(err){
//       req.flash("error",err.message);
//       return res.redirect("/checkout");
//     }
//     req.flash("success","Successfully bought product");
//     req.session.cart = null;
//     res.redirect('/');
//   })
// })
router.post("/checkout" ,isLoggedIn, function(req,res,next){
  if(!req.session.cart){
    return res.redirect("/shopping-cart");
  }
  var cart=new Cart(req.session.cart);
  

  // var stripe=require("stripe")("sk_test_UFzSrj0WMwU52XJEEr3Q1RBx00Fm1DryBl");
  // console.log( req.body.stripeToken)
  // stripe.charges.create({
  //   amount: cart.totalPrice * 100,
  //   source: req.body.stripeToken,
  //   currency: 'INR'
  // } , function(err,charges){
  //   if(err){
  //     req.flash("error",err.message);
  //     return res.redirect("/checkout");
  //   }
  //   req.flash("success","Successfully bought product");
  //   req.session.cart = null;
  //   res.redirect('/');
  // })
  const amount = cart.totalPrice * 100;
    
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer => stripe.charges.create({
    amount,
    description: 'Shopping Cart',
    currency: 'INR',
    customer: customer.id
  }))
  .then(charge => {
    var order = new Order({
      user:req.user,
      cart:cart,
     // address:req.body.address,
     // name:req.body.name,
     paymentId: charge.id
    })
    order.save(function(err,result){
       
    req.flash("success","Successfully bought product");
    req.session.cart = null;
    res.redirect('/');
    });
  });
  
})

module.exports = router;
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
      return next();
  }
  req.session.oldUrl = req.url;
  res.redirect("/user/signin");
}