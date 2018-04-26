var mongoose = require('mongoose');


var ProductsSchema =new mongoose.Schema({
  name : {
    type: String,
    required: true,
    minlength: 1,
    unique: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 200
  },
  imagePath: {
    type: String,
    required: true

  },
  price: {
    type: Number,
    required: true,
    min : 1
  },
  category:{
    type: String,
    required: true,
    enum : ['firstPlate','secondPlate','dessert']
  }


});

var Product = mongoose.model('Product',ProductsSchema);
module.exports ={Product};
