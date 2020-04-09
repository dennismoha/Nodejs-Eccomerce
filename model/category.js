const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
	name:{type:String,trim:true,maximum:30, min:5},
	sep :{type:String} //this makes sure that each category is unique

})

module.exports = mongoose.model('category',categorySchema)