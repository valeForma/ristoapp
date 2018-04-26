var mongoose = require('mongoose');


var {Product} =require('./products');

var ordersSchema = new mongoose.Schema({

  date : {
    type: Date,
    required: true,
    default : Date.now
  },
  persons : {
    type : Number,
    required: true,
    min : 1,
    max : 12,
    default: 1
  },
  state: {
    type: String,
    required:true,
    enum:['processing','completed'],
    default : 'processing'
  },
  belongTo: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,

  },
  total: {
    type: Number,
    required: true,
    min : 1
  },
  products: [{
   product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity:{
     type: Number,
     required:true,
    }
}
  ]

});


var Order =mongoose.model('Order',ordersSchema);

module.exports={Order};
