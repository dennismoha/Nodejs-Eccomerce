const express = require('express');
const category = require('../controller/category');

const cateRoute = express.Router();


cateRoute.post('/category/new_category',category.createCategory);
cateRoute.get('/category/get_category',category.getCategories);
cateRoute.post('/category/edit/:id',category.category_edit);
cateRoute.get('/category/editPage/:id',category.cateEditPage)
cateRoute.get('/category/remove/:id',category.removeCategory)
module.exports = cateRoute