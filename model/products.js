const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
	title: {
            type: String,
            trim: true,   
            required:true
        },
        description: {
            type: String,
            required: true,
            trim: true           
        },
        price: {
            type: Number,
            trim: true,
            required: true,
            
        },     

        category: {
            type:String,
            required:true,
            trim:true
           
        },
        quantity: {
            type: Number,
            required:true
        },       
        image: {
            type: String //buffer, allows us store images in data in form of arrays
            
        },
        reviews:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'reviews'
        }] ,
        sep: {
            type:String
        }
              

},{timestamps:true})

module.exports = mongoose.model('products',propertySchema)