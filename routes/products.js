const express = require('express');
 const Products = require('../controller/products');
 const roles = require('../controller/checkroles');


// const grid = require('gridfs-stream');
 const propRoute = express.Router();


// propRoute.get('/property/Search',Properties.Search)
 //propRoute.post('/property/new_property',roles.allowIfLoggedin,Properties.new_property)

 //propRoute.get('/property/all_properties',roles.allowIfLoggedin,Products.products);
 //propRoute.get('/products/user_property_page',roles.allowIfLoggedin,roles.allowIfLoggedin,Products.user_products_page);
// //landing page property
 propRoute.get('/products/user_landing_products_page',Products.user_landing_products_page);
 propRoute.get('/products/category/:sep',Products.categorySep)
 propRoute.get('/products/latest',Products.latestProd)
 propRoute.get('/product/one/:category/:sep',Products.oneProduct)
 propRoute.get('/product/home/',Products.home);
 propRoute.get('/product/addToCart/:id',Products.cart);
 propRoute.get('/product/displayCart/',Products.displayCart);
 propRoute.get('/checkout/',roles.allowIfLoggedin,Products.checkout);
 propRoute.post('/checkout/',roles.allowIfLoggedin,Products.checkoutt);
// //show page for each property
// propRoute.get('/property/:id/show',roles.allowIfLoggedin,Properties.oneProperty)




module.exports = propRoute;