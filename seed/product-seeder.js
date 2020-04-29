var Product = require("../models/product");
var express = require('express');

var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost/shop_cart",{ useNewUrlParser: true , useUnifiedTopology: true  } );
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose_db'))
// mongoose.connect("localhost:27017/shopping_cart");

var products = [
    new Product({
    imagePath:"images/t1.jpg",
    title:"Plain T-shirt",
    description:"Men's Designer T-Shirt!!!",
    price:10
  }),
  new Product({
    imagePath:"images/t2.jpg",
    title:"Color Block Men Hoodie",
    description:"Men's Designer T-Shirt!!!",
    price:30
  }),
  new Product({
    imagePath:"images/t3.jpg",
    title:"Graphic Print Men Tshirt",
    description:"Men's Designer T-Shirt!!!",
    price:90
  }),
  new Product({
    imagePath:"images/t4.jpg",
    title:"Printed T-Shirt",
    description:"Men's Designer T-Shirt!!!",
    price:45
  }),
  new Product({
    imagePath:"images/t5.jpg",
    title:"Self Design Men Hoodie",
    description:"Men's Designer T-Shirt!!!",
    price:35
  }),
  new Product({
    imagePath:"images/t6.jpg",
    title:"Solid Men V Neck",
    description:"Men's Designer T-Shirt!!!",
    price:50
  }),
  new Product({
    imagePath:"images/t7.jpg",
    title:"Solid Men Round Neck",
    description:"Men's Designer T-Shirt!!!",
    price:98
  }),
  new Product({
    imagePath:"images/t8.jpg",
    title:"PerfecrFit Tshirt",
    description:"Men's Designer T-Shirt!!!",
    price:32
  }),
  new Product({
    imagePath:"images/t9.jpg",
    title:"Solid Men Polo",
    description:"Men's Designer T-Shirt!!!",
    price:75
  })
];

var done=0;
for(var i=0;i<products.length;i++){
    products[i].save(function(err,result){
        done++;
        if(done===products.length){
            exit();
        }
    });
}
function exit(){
    mongoose.disconnect();
}
