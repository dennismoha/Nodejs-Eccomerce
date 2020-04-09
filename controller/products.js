const Products = require('../model/products');
const Category = require('../model/category')
const Cart = require('../model/cart');
const Order = require('../model/order');
const fs = require('fs-extra');

//in the landing page section,  i need all properties and all properties by category

//shows info about a single product when clicked
const oneProduct = (req,res)=> {
	var galleryImage ;
Products.findOne({sep:req.params.sep}).then((product)=> {
		if(product) {
			var galleryImage = 'public/productImage/' + product.id + '/gallery/';
			fs.readdir(galleryImage,(err,files)=> {
				if(err) {
					throw err
				}
				galleryImage = files
				res.render('home/singleProduct',{product:product,gallery:galleryImage})
			})
		}
	}).catch((error) => {
		throw error
  })
}

//takes us to the home page after login
const home = (req,res) => {
	res.render('home/home')
}

//this add products to cart
const cart = (req,res) => {
	const id = req.params.id
	var cart = new Cart(req.session.cart ? req.session.cart:{});

	Products.findById(req.params.id,(err,product)=> {
		if(err) {
			throw err
		}
		cart.add(product, product.id);
		req.session.cart = cart;
		res.redirect('back')
		console.log(req.session.cart)
	})

}


//getting all properties
// const products = (req,res) => {
// 	console.log('this is the products route')
// 	// Property.find().then(
// 	// 	(property)=> {
// 	// 		if(property) {
// 	// 			 res.render('landlord/all_properties',{property: property})

// 	// 		}
			
// 	// 	}).catch((error)=> {
// 	// 		throw error
// 	// 		console.log('error in the find all property route',error)
// 	// 	})
// }


// const oneProperty = (req,res) => {
// 	Property.findById(req.params.id).populate('reviews').exec((err,property)=> {
// 		if(err) {
// 			console.log('error populating the reviews ');
// 			throw err
// 		}
// 		console.log(property)
// 		res.render('properties/show',{property:property})
// 	})
// }



// const user_products_page = (req,res) => {
// 	Products.find().then(
// 		(property)=> {
// 			if(property) {

// 				 res.render('home/property',{property: property})

// 			}
			
// 		}).catch((error)=> {
// 			throw error
// 			console.log('error in the find all property route',error)
// 		})
// }

//user landing page code
const user_landing_products_page = (req,res)=> {
	Category.find().then((category)=> {
		if(category) {
			Products.find().then((products)=> {
				if(products) {
					const produ = [];
					res.render('home/landing',{products: products,category:category,produ:produ})
				}
			}).catch((error)=> {
				throw error
			})
		}
	}).catch((error)=> {
		throw error
	})
}

//shows products by categories
const categorySep = (req,res) => {
	const categorySep = req.params.sep
	console.log('this is the category sep params',categorySep);
	console.log('this is the req params',req.params)	
		
	Category.findOne({sep:categorySep}).then((cat)=> {
		if(cat){					
			Products.find({category:categorySep}).then((product)=>{
				if(product){
				res.render('home/productsCategory',{category:cat,product:product})
					}
				}).catch((error)=> {
					throw error
				})
			}
					
		})
	}
		

//latest products
const latestProd = (req,res)=> {
	Products.find({}).sort({createdAt:'desc'}).exec(function(err,prod) {
		if(err) {
			throw err
		}else {
			res.render('home/latest',{prod:prod})

		}
	})
}	

//the shopping cart route
const displayCart = (req,res)=> {
	if(!req.session.cart) {
		return res.render('home/shoppingCart',{products:null})
	}
	var caart = new Cart(req.session.cart);
	//res.render('home/shoppingCart',{products:cart,totalPrice:cart.totalPrice})
	console.log('this is the caart', caart);
	console.log('the id is', caart.items);

	


	res.render('home/shoppingCart',{products:caart.generateArray(), totalPrice:caart.totalPrice})


	

	
}

//checkout page
const checkout = (req,res) => {
	if(!req.session.cart) {
		return res.render('home/shoppingCart',{products:null})
	}
	var caart = new Cart(req.session.cart);
	res.render('home/checkout',{total:caart.totalPrice});
}
	
const checkoutt = (req,res) => {
	if(!req.session.cart) {
		return res.render('home/shoppingCart',{products:null})
	}
	var caart = new Cart(req.session.cart);
	var order = new Order({
		user: req.user,
		cart:caart,
		address:req.body.address,
		name: req.body.name
	})

	order.save((err,results)=> {
		if(err) {
			throw err
		}
		req.session.cart = null;
		res.redirect('back')
	})
}
	



// const Search = (req,res) => {
// 	const Name = req.query.search;
// 	console.log(req.query.search)
// 	category.find({name:req.query.search},function(err, results) {
// 		if(err) {
// 			throw err
// 		} else if(results && results.length == 0) {
// 			res.json({message: 'property not found'})
// 		}else {
// 		console.log('these are the results',results)
// 		res.json(results)
	
// 	}
// 	})
// }

// module.exports = {properties,new_property,user_property_page,user_landing_property_page,Search,oneProperty }

module.exports = {user_landing_products_page,categorySep,latestProd,oneProduct,home,cart,displayCart,checkout,checkoutt}
//products,user_products_page