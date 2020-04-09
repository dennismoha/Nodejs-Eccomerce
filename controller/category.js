const Category = require('../model/category');
const { check, validationResult } = require('express-validator');
//new category
const createCategory = (req,res)=> {
	let name = req.body.name
	let sep = name.replace(/\s+/g,'-').toLowerCase();

	req.checkBody('name','name cannot be empty').notEmpty();
	var errors = req.validationErrors();
				if(errors) {
					var messages = [];
					errors.forEach(function(error) {
							messages.push(error.msg)
						})	
						req.flash('error',messages)
						console.log(messages)
					res.render('Admin/create_category',{messages:req.flash('error'),name:req.body.name})			
	}


	Category.findOne({sep:sep},(err,category)=> {
					if(category) {
						req.flash('error','category exists');
						res.render('Admin/create_category',{messages:req.flash('error'),name:req.body.name})
					}else {

						const category = new Category({
								name:req.body.name,					
								sep: sep
					
						});

							console.log('this is the category',category)

				category.save().then((category)=> {
					if(category) {

							Category.find().then((category)=> {
							  if(category) {
							    req.app.locals.category = category
							  }
							}).catch((error)=> {
							  throw error
							})

						req.flash('info','category successfully created')
						// res.render('admin/pages',{page:page,message:req.flash('info')})
						res.render('Admin/view_categories',{category:category})
							}
					}).catch((error)=> {
						throw error
							})

					}
				})


}

//getting all categories

const getCategories = (req,res) => {
	Category.find().then(
		(category)=> {
			if(category) {
				console.log('category')
				res.render("Admin/all_categories",{category:category})
			}
		}).catch(
		(error)=> {
			throw error;
			console.log('error getting all categories',error)
		})
}



//edit category page
const cateEditPage = (req,res) => {
	const id = req.params.id
	Category.findById(id).then((category)=> {
		if(category) {
			req.flash('success','category found');
			res.render('Admin/categoryEdit',{category:category,messages:req.flash('success')})
		}
	})

}


//editing post category
const category_edit = (req,res)=> {
	var name = req.body.name;
	var id = req.params.id
	var sep =name.replace('/\s+/g','-').toLowerCase();

	req.checkBody('name','name cannot be empty').notEmpty()
	
	
	var errors = req.validationErrors();
				if(errors) {
					var messages = [];
					errors.forEach(function(error) {
							messages.push(error.msg)
						})	
						req.flash('error',messages)
						console.log(messages)
					res.render('Admin/categoryEdit',{messages:req.flash('error'),name:req.body.name})			
				}

	Category.findOne({sep:sep,id:{'$ne':id}},(err,category)=> {
		if(category) {
			req.flash('error','category exists')
			res.render('Admin/categoryEdit',{messages:req.flash('error'),category:category,id:id})
		}else {
	Category.findById(req.params.id,(err,category)=>{
		if(err) {
			return console.log(err)
		}else {
			category.name = name;
			category.sep = sep;

			category.save().then((category)=> {
				if(category) {


					Category.find().then((category)=> {
					  if(category) {
					    req.app.locals.category = category
					  }
					}).catch((error)=> {
					  throw error
					})

					req.flash('info','category successfully edited');
					res.redirect('/category/category/get_category')
				}
			}).catch((error)=> {
				console.log(error)
			})

		}
	})
		}
	})

	
}

//deleting a category
const removeCategory = (req,res) => {
	Category.findByIdAndRemove(req.params.id,(err)=> {
		if(err) {
			throw err
		}
		Category.find().then((category)=> {
			if(category) {
				req.app.locals.category = category
			}
		}).catch((error)=> {
			throw error
		})
		req.flash('success','category removed successfully');
		res.redirect('/category/category/get_category');
	})

}


module.exports = {createCategory,getCategories,category_edit,cateEditPage,removeCategory}
