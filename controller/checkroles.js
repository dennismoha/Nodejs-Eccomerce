const User = require('../model/users_singup');
 
const AccessControl = require('accesscontrol');
const ac = new AccessControl();
const {roles} = require('../roles')


exports.grantAccess =(req,res,next) => {
	console.log(req.user.role)
	const roles = req.user.role
	if(req.user.role !== 'admin') {
		res.send('your  an admin')
	}else {
		next()
	}
}




exports.allowIfLoggedin = (req, res, next) => {
		if(req.isAuthenticated()) {
				return next();
		}	
		req.session.oldUrl = req. _parsedOriginalUrl.href
		console.log(req. _parsedOriginalUrl.href)	
		res.redirect('/page/users/login')
	}