const express = require('express');
const passport = require('passport');
const userRoute = express.Router();
const Usersign = require('../controller/user_auth');
const checkRole = require('../controller/checkroles');


userRoute.post('/user/singup',Usersign.singup);

userRoute.post('/user/login',passport.authenticate('local',{
	failureRedirect: '/page/users/login',
		failureFlash : true,
	}),function(req,res,next){
		if(req.session.oldUrl) {
			var oldUrl = req.session.oldUrl;
			req.session.oldUrl = null;
			res.redirect(oldUrl)
		}else {
			res.redirect('/products/product/home/');
		}		
})

 userRoute.get('/users/profiles/',checkRole.allowIfLoggedin, Usersign.profiles)
userRoute.get('/users',  Usersign.allUsers);
userRoute.get('/users/getUser/:id',Usersign.getUser) //getting a single user
// userRoute.put('/users/updateUser/:id',function(req,res) {
// 	res.send('reached edit point')
// })

userRoute.delete('/users/removeUser/:id',Usersign.deleteUser) //removing a single user
 userRoute.put('/users/updateUser/:id',Usersign.updateUser)


userRoute.get('/users/logout',Usersign.logout);




module.exports = userRoute;





