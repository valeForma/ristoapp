const  mongoose = require('mongoose');
const  validator = require('validator');
const  jwt = require('jsonwebtoken');
const  _ = require('lodash');
const bcrypt =require ('bcryptjs');


var UserSchema = new mongoose.Schema({
  email : {
    type : String,
    required : true,
    trim : true,
    minlength : 1 ,
    unique : true,
    validate : {
      validator :validator.isEmail,
      message : '{VALUE} non e un indirizzo mail valido'
    }
  },
  name :{
    type: String,
    trim: true,
    minlength: 1,
      default :'anonymous'

  } ,
  surname: {
      type: String,
      trim: true,
      minlength: 1 ,
      default :'anonymous'
  },
  address:{
      type: String,
      trim: true,
      minlength: 1
  },
  phone:{
      type: String,


  },
  password : {
    type : String,
    required : true,
    minlength : 8

      },
   tokens: [
     {
       access: {
         type: String,
         required: true
       }

       ,
       token: {
         type: String,
         required: true
       }

     }
   ]

});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  return _.pick(user,['_id','email']);
};

UserSchema.methods.generateAuthToken = function (){
  var user = this;
  var access = 'auth';
  var token = jwt.sign({ _id : user._id.toHexString() , access }, process.env.JWT_SECRET).toString();

  user.tokens.push({access , token});
  return user.save().then( () => {
      return token;
  });

};

UserSchema.methods.RemoveToken = function (token){
  var user=this;

  return user.update({
     $pull : {
       tokens : {token}
     }
  });
};

UserSchema.statics.findByToken = function (token) {
  var user = this;
  var decoded ;
  try{
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  }
  catch(e)
  {
    return Promise.reject();
  }
  return user.findOne({
    '_id' : decoded._id,
    'tokens.token' : token,
    'tokens.access' : 'auth'
  });
};
UserSchema.statics.FindByCredentials = function (email, password){
  var User = this;

  return User.findOne({email}).then((user) => {
      if(!user){
        console.log('not found');
      return Promise.reject();
            }
      return new Promise((resolve,reject) =>{
          bcrypt.compare(password,user.password, (err,res) => {
              if(res){
                console.log('user found');
                resolve(user);
              }
              else{
                console.log('not found 2');
                reject();
              }
          });
      });
  });
};
UserSchema.pre('save',function (next){
  var user = this;
  if(user.isModified('password')){
      bcrypt.genSalt(10 , (err , salt) =>{
        bcrypt.hash(user.password,salt,(err , hash) =>{
          user.password=hash;
          next();
          });
      });
  }
  else{
    next();
  }
});

var User = mongoose.model('User' , UserSchema);

module.exports={ User }