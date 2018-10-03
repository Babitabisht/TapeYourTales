const LocalStrategy=require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');
//const passport=require('passport');

//Load user Model

const User = mongoose.model('CUsers');

module.exports= function(passport){

passport.use(new LocalStrategy({usernameField:'email'},(email,password,done)=>{

    // console.log(email);
    // console.log(password);
//Match user
    User.findOne({
        email:email
    }).then(user =>{
        if(!user){
            console.log('no user found');
            return done(null,false,{message:'no user found'});
        }
//Match password
bcrypt.compare(password,user.password ,(err,isMatch)=>{
    console.log('in compare function');
    if(err) throw err;
    console.log('no error');
    if(isMatch){
        console.log("in is match");
        console.log(user);
        return done(null,user);
    }else{
            console.log('in else');
        return done(null,false,{message:'Password Incorrect'});
           

    }

})
    })

}))

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

}

