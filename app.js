require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const path = require('path')
const session = require('express-session');
const flash = require('connect-flash')
const passport = require('passport');
const methodOverride = require('method-override');
const ejs = require('ejs');
const Validator = require('express-validator');
const fileUpload = require('express-fileupload')
const mongoSession = require('connect-mongo')(session)//mongo connect for storing sessions in the db
const app 	= express();

 app.use(express.static(__dirname + "/public"));
 app.use(express.static(__dirname + '/public/js'));
//user routes
const user = require('./routes/user_auth');
const pages = require('./routes/pages')
const admin = require('./routes/admin');
const products = require('./routes/products');
const category = require('./routes/category');
const reviews = require('./routes/reviews');

//import category models to set our local variables
var Category = require('./model/category')

app.set('view engine','ejs');

// require('./config/landlord_config')(passport);
require('./config/passport')(passport);

require('dotenv').config();

mongoose.connect('mongodb://localhost:27017/dianaSchool', {useNewUrlParser: true});
app.use(fileUpload({
	createParentPath: true
}))
app.use(session({
	secret: "secretstringauth",
	resave: true,
	saveUninitialized: true,
	store: new mongoSession({mongooseConnection: mongoose.connection}),//tells mongo connect not to open a new session
	cookie:{maxAge: 120 * 60 * 1000} //how long the cookie live and it's in milliseconds
	
}))

app.use(methodOverride('_method'));

//body-parser middleware but in express
app.use(express.urlencoded({extended:true}));

//initializing passport
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());


//category find all local variable
Category.find().then((category)=> {
	if(category) {
		app.locals.category = category
	}
}).catch((error)=> {
	throw error
})

	
//express validator setup
app.use(Validator({
  customValidators: {
    isImage: function(value,filename) {
      var extension = (path.extname(filename)).toLowerCase();
      switch(extension) {
        case '.jpg':return '.jpg';
        case '.jpeg':return '.jpeg';
        case '.png':return '.png';
        case '':return '.jpg';
        default: return false;
      }
    }
  }
}))

//global variables
app.use((req,res,next)=> {
	res.locals.currentUser = req.user;
	res.locals.property_got = req.property
	res.locals.session = req.session;
	res.locals.sucess = req.flash('sucess');
	res.locals.error =  req.flash('error');
	res.locals.error_login =  req.flash('error_login');
	res.locals.messages = req.flash('messages');
	next();
});




//user routes
app.use('/users',user);
app.use('/page',pages);
app.use('/admin',admin);
app.use('/products',products);
app.use('/category',category);
app.use('/review',reviews)



const port =  process.env.PORT || 8000

app.listen(port,(err)=> {
	if(err) {
		console.log('server starting error!')
	}
	console.log(`successfully started serve ${port}`)

})
