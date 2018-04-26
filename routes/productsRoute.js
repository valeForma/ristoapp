var  _ =require('lodash');
var express = require('express');
const {ObjectID} = require('mongodb');

var {Product} = require('../models/products');


var productsRouter = express.Router();

productsRouter.get('/',(req,res) => {
  Product.find().then((products) =>{
    if(!products){

    return res.status(400).send();
    }

    console.log(products);
    res.status(200).send(products);
},(e) => {
   res.status(400).send(e);

  });

});
productsRouter.post('/insert',(req,res) => {
    var body=_.pick(req.body,['name','description','imagePath','price','category']);
    console.log(body);
    var product=new Product(body);
    product.save().then((prod) =>{
      if(!prod){
      return  res.status(400).send();
      }
      res.status(200).send(prod);
    },(e) => {
  res.status(400).send(e);
    });
});

productsRouter.delete('/delete/:id',(req,res) => {
  var id=req.params.id;
  if(!ObjectId.isValid(id)){
   return res.status(400).send();
  }
  Product.findOneAndRemove({_id: id}).then((prod)=>{

    if(!prod){
      return res.status(400).send();
      }

    res.status(200).send(prod);

  }).catch(()=>{
    res.status(400).send();
    });
});
productsRouter.patch('/update',(req,res) => {


});

module.exports = {productsRouter};
