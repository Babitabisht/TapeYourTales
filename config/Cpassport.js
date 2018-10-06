const LocalStrategy=require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');
const passport=require('passport');
//const User =require('../models/CUser')
//Load user Model

require('../models/CUser');
const User = mongoose.model('CUsers');


module.exports=function(localC){
console.log(localC)
    //local Strategy
console.log("inside passport...........");

localC.use(
    new LocalStrategy({
        usernameField:'email'},(email,password,done)=>{
//match usernaame
console.log(email);
console.log(password)
let query ={email:email};

User.findOne(query , function(err,user){
    console.log("Before error")
    if(err) throw err;
if(!user){

    return done(null,false,{message:'No user Found'});
    
}

bcrypt.compare(password,user.password,function(err,isMatch){
    console.log("In compare function......")
if(err) throw err;
if(isMatch){
    
    console.log("here......")
    console.log(user)
    return done(null,user);
    
}else{
    return done(null,false,{message:'Wrong password'})
}

})

})



    }))


    passport.serializeUser(function(user, done) {
          console.log("in serialize user............")
        done(null, user.id);
      });
      
      
    passport.deserializeUser(function(id, done) {
          console.log("in deserialize user........")
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });


}