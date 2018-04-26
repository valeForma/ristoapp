const express =require('express');
const _ =require('lodash');
const {ObjectID} = require('mongodb');

var {authenticate}= require('../auth/auth');
var {Order} =require('../models/orders');
var {Product} =require('../models/products');
var orderRouter =express.Router();

orderRouter.get('/' ,authenticate,(req,res) => {
  Order.find({belongTo: req.user._id}).populate('products.product').then((orders) =>{
    if(!orders){
      res.status(400).send();
      }

     res.status(200).send(orders);
}).catch(()=>{
  res.status(400).send();
});

});
orderRouter.post('/insert',authenticate  ,(req,res) => {

  var order = new Order({
      date: Date.now(),
      persons : req.body.persons,
      total : req.body.total,
      date : req.body.date,
      state : 'processing',
      products : [],
      belongTo : req.user.id
  });
  req.body.products.forEach((p) => {
      order.products.push({'product': p.product._id , 'quantity': p.quantity });

  });

  console.log(order);
  order.save().then((ord) => {
    if(!ord){
    return res.status(400).send();
    }
    res.status(200).send(ord);
  },(e) => {
      console.log(e);
     res.status(400).send(e);
});
});
orderRouter.patch('/edit/:id' ,(req,res) => {

});
orderRouter.delete('/delete/:id' ,(req,res) => {

});

module.exports ={orderRouter};
