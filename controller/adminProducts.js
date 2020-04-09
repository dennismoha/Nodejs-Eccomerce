//crud products
const Product = require('../model/products');
const Category = require('../model/category');
const { check, validationResult } = require('express-validator');
const path = require('path')
var mv = require('mv')
const fs = require('fs-extra')
const mkdirp = require('mkdirp')
const resizeImg = require('resize-img')

//takes you to the new product page form
const newProductpage = (req,res) => {
	Category.find().then((category)=> {
		if(category) {
			res.render('Admin/products/newProducts',{category:category})
		}
	}).catch((error)=> {
		throw error
	})	
}

//posts the new product
const newProduct = (req,res)=> {
	var imageFile;
	if(!req.files) {
		imageFile = "";
	}else {
		imageFile = req.files.image.name
		var imageFil = req.files.image
	}

	req.checkBody('image','you must upload an image').isImage(imageFile)				
	req.checkBody('title','title cannot be empty').notEmpty()
	req.checkBody('description','content cannot be empty').notEmpty()
	req.checkBody('price','price cannot be empty').notEmpty()
	req.checkBody('quantity','quantity cannot be empty').notEmpty()

	const title = req.body.title;
	const sep = title.replace(/\s+/g,'-').toLowerCase();
	var description = req.body.description;
	var price = req.body.price;
	var category = req.body.category;
	var quantity  = req.body.quantity;

	var errors = req.validationErrors();				
				if(errors) {
					Category.find((err,category)=> {
						if(err) {
							throw err
						}
						var messages = [];
						errors.forEach(function(error) {
							messages.push(error.msg)
						})
						req.flash('error',messages)
						res.render('Admin/products/newProducts',{messages:req.flash('error'),title:title,description:description,price:price,category:category,quantity:quantity})
					})
				}

				Product.findOne({sep:sep},(err,product)=> {
					if(product) {
						req.flash('error','product exists');
						Category.find((err,category)=> {
							res.render('Admin/products/newProducts',{messages:req.flash('error'),title:title,description:description,price:price,category:category,quantity:quantity})
						})
						
					}else {
						var price3 = parseInt(price).toFixed(2);
					const products = new Product({
						title:title,
						description: description,
						sep: sep,
						price: price3,
						category:category,
						quantity:quantity,
						image:imageFile
				});

				products.save().then((product)=> {
					if(product) {
						req.flash('info','successfully created')				

						mkdirp('public/productImage/' + product.id).then(made =>
  							console.log(`made directories, starting with ${made}`))

						mkdirp('public/productImage/' + product.id + '/gallery').then(made =>
  							console.log(`made directories, starting with ${made}`))

						mkdirp('public/productImage/' + product.id + '/gallery/thumbs').then(made =>
  							console.log(`made directories, starting with ${made}`));						

						if(imageFile !="") {
							
							let productImage = req.files.image
							console.log('the image is:',productImage)
							var path = 'public/productImage/' + product.id + '/'  + imageFile

							productImage.mv(path,(err)=> {
								return console.log(err)
							})
						}
						
						req.flash('info','product added');
						res.redirect('/admin/products/')
					
							}
					}).catch((error)=> {
						throw error
							})

					}
				})
}

//display all products
const allProducts = (req,res) => {
	Product.find().then((product)=> {
		if(product) {
			req.flash('success','all products page')
			res.render('Admin/products/allProducts',{product:product,messages:req.flash('success')})
		}
	}).catch((error)=> {
		throw error
	})
}

//show products route,edit products page, delete products

//generates a single product
const showProduct = (req,res)=> {
	const id = req.params.id
	Product.findById(id).then((product)=> {
		if(product) {
			res.render('Admin/products/oneProduct',{product:product})
		}
	}).catch((error)=> {
		throw error
	})
}

//delete product
// const removeProduct = (req,res) => {
// 	Product.findByIdAndRemove(req.params.id,(err)=> {
// 		if(err) {
// 			throw err
// 		}
// 		res.send('product removed successfully');
// 	})
// }

//edit product route
const editProduct = (req,res) => {
	var errors;
	if(req.session.errors) errors = req.session.errors;
	req.session.errors = null;

	Category.find((err,categories)=> {
		Product.findById(req.params.id,(err,product)=> {
			if(err) {
				throw err
			}else {
				const gallerDir = 'public/productImage/' + product.id + '/gallery'; //directory to the product gallery folder
				var galleryImages = null;

				fs.readdir(gallerDir,(err,files)=> {
					if(err) {
						throw err
					}else {
						galleryImages = files;
						req.flash('success','reached product edit page')
						res.render('Admin/products/editProducts',{
							title: product.title,
							description:product.description,
							categories:categories,
							category:product.category.replace(/\s+/g,'-').toLowerCase(),
							price: product.price,
							 quantity:product.quantity,
							image: product.image,
							galleryImages: galleryImages,
							id:req.params.id,
							messages:req.flash('success')
						})
					}
				})
			}

		})
	})
}

//edit product post
const editSaveProduct =(req,res)=> {

	var imageFile;
	if(!req.files) {		
		res.send({
			status:false,
			message: 'no file upload'
		});
	}else {
		imageFile = req.files.image.name
		var imageFil = req.files.image
	}

	

	req.checkBody('image','you must upload an image').isImage(imageFile)				
	req.checkBody('title','title cannot be empty').notEmpty()
	req.checkBody('description','content cannot be empty').notEmpty()
	req.checkBody('price','price cannot be empty').notEmpty()
	req.checkBody('quantity','quantity cannot be empty').notEmpty()

	const title = req.body.title;
	const sep = title.replace(/\s+/g,'-').toLowerCase();
	var description = req.body.description;
	var price = req.body.price;
	var category = req.body.category;
	var pimage = req.body.pimage;
	var quantity = req.body.quantity;
	var id = req.params.id;


	var errors = req.validationErrors();
	if(errors){
	
		var messages = [];
						errors.forEach(function(error) {
							messages.push(error.msg)
						})
						req.flash('error',messages)
						res.render('Admin/products/newProducts',{messages:req.flash('error'),title:title,description:description,price:price,category:category,quantity:quantity})
		
	}else {
		Product.findOne({sep:sep,id:{'$ne':id}},(err,product)=> {
			if(err) {
				throw err
			}
			if(product) {
				req.flash('error','product exist choose another one');
				res.send(product)
			}else {
				Product.findById(id,(err,product)=> {
					if(err) {
						throw err
					}
					product.title = title;
					product.description = description;
					product.sep = sep;
					product.price = parseFloat(price).toFixed(2);
					product.category = category;
					product.quantity = quantity;

					if(imageFile !=""){
						product.image = imageFile
					}

					product.save((err)=> {
						if(err) {
							throw err
						}
						if(imageFile!= "") {
							if(pimage !="") {
								fs.remove('public/product' + id + '/'+pimage,(err)=>{
									if(err) {
										throw err
									}
								})
							}
						}

						let productImage = req.files.image;
						var path = 'public/productImage/' + product.id + '/' + imageFile;

						productImage.mv(path,(err)=> {
							return console.log(err)
						})
					})

					req.flash('info','product edited');
					res.redirect('/admin/show/product/' + product.id)
				})
			}
		})
	}

}

//product gallery section
//gallery route
const productGallery = (req,res)=> {
	let productImage = req.files.file
	console.log(productImage)
	const id = req.params.id;			
	const path = 'public/productImage/' + id +'/gallery/' + req.files.file.name
	const thumb = 'public/productImage/' + id + '/gallery/thumbs/' + req.files.file.name

	productImage.mv(path,(err)=> {
		if(err) {
			throw err
		}

		resizeImg(fs.readFileSync(path),{width: 100,height:100}).then(function(buf) {
			// fs.writeFileSync(thumbs,buf)
			console.log('this is the buf',buf)
			fs.writeFileSync(thumb, buf);
		})
	})

		
	res.sendStatus(200)
}

const removeProduct = (req,res) => {
	const id = req.params.id
	fs.rmdir('public/productImage/' + req.params.id,{recursive:true},(err)=>{
		if(err) {
			throw err
		}else {
			Product.findByIdAndRemove(id,(err)=> {
				if(err) {
					throw err
				}
				res.redirect('/admin/products/')
			})
		}
	})
}

//delete product gallery route
const removeProductGallery =(req,res)=> {
	console.log('this is the req query',req.params.id)
	const originalFile = 'public/productImage/' + req.query.id +'/gallery/' + req.params.image;
	const thumbfile = 'public/productImage/' + req.query.id + '/gallery/thumbs' + req.params.image;

	fs.unlink('public/productImage/' + req.query.id +'/gallery/' + req.params.image,(err)=> {
		if(err) {
			throw err
		}else {
			fs.unlink('public/productImage/' + req.query.id + '/gallery/thumbs' + req.params.image,(err)=> {
				if(err) {
					throw err
				}else {
					req.flash('success','image removed');
					res.redirect('/admin/products')
				}
			})
		}
	})
}



module.exports = {newProductpage,newProduct,allProducts,showProduct,removeProduct,editProduct,editSaveProduct
	,productGallery,removeProductGallery}

