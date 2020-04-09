const express = require('express');
const Adminroute = require('../controller/admin');
const Adminproducts = require('../controller/adminProducts');
const roles = require('../roles')
const router = express.Router();


router.post('/admin/createUser',Adminroute.createUser)
router.get('/admin/getUser',Adminroute.getUsers);

//products route
router.get('/newProduct/',Adminproducts.newProductpage)
router.post('/newProduct/',Adminproducts.newProduct);
router.get('/products/',Adminproducts.allProducts)
router.get('/show/product/:id/',Adminproducts.showProduct) //gets a single product

router.get('/edit/product/:id',Adminproducts.editProduct);//edit product page
router.post('/edit/product/:id',Adminproducts.editSaveProduct);//edit product post
router.post('/productGallery/:id',Adminproducts.productGallery)
router.get('/products/remove/:id',Adminproducts.removeProduct)
router.get('/products/delete_image/',Adminproducts.removeProductGallery)

module.exports = router