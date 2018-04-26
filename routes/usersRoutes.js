var express = require('express');
var _ =require('lodash');
var {User} = require('../models/users');
var {authenticate} = require('../auth/auth');

var userRouter = express.Router();

userRouter.post('/register', (req,res) => {
    var body= _.pick(req.body , ['email' , 'password','name','surname','address','phone',]);
  var user = new User(body);
  console.log(body);
  console.log(user);
  user.save(user).then((user) => {

      return user.generateAuthToken();
  }).then((token) => {
    var userData={
        token: token,
        user: user
    };
  res.header('x-auth',token).send(userData);
}).catch((e) => {

  res.status(400).send(e);
})


});
userRouter.post('/login' , (req ,res ) => {
    var body= _.pick(req.body , ['email' , 'password','name','surname','address','phone',]);

    User.FindByCredentials(body.email , body.password ).then((user) =>{

      return user.generateAuthToken().then((token) =>{
         var userData={
             token: token,
             user: user
         };
        res.header('x-auth',token).send(userData);

      });

    }).catch((e)=>{

      res.status(400).send(e);
  });
});
userRouter.post('/checkemail',(req,res)=>{
    var body= _.pick(req.body , ['email' ]);
    User.find({'email': body.email} ).then((user)=>{
        console.log('user is '+user);
        if(!user){
            res.send(null);
            }
        else{
            res.send({'emailInvalid' : true})
            }
    }).catch((e)=>{
        console.log(e);
        res.send(null);
    });
});
userRouter.post('/logout' ,authenticate,(req,res) =>{

  req.user.RemoveToken(req.token).then( ()=>{
    res.status(200).send();
  }).catch( () => {
  res.status(500).send();
  });
});
module.exports ={userRouter};
