const express =require('express');
const router= express.Router();
const mongoose=require('mongoose');
const  Story=mongoose.model('stories');
const {ensureAuthenticated,ensureGuest}=require('../helper/auth');
const Feedback=mongoose.model('feedback');
const bcrypt=require('bcryptjs');
//const passport=require('../config/Cpassport');
const passport=require('passport');
//const passport=require('./config/Cpassport')(passport);

var localS = new passport.Passport();
require("../config/Cpassport")(localS);

require('../models/CUser');
const CUsers=mongoose.model('CUsers');


router.get('/',ensureGuest,(req, res)=>{
    res.render('index/welcome');
});


//-------------------
router.get('/login',(req,res)=>{
    res.render('index/login')
    
    })
    
    //login form post
    
    router.post('/login',(req,res,next) => {
        console.log('in post')
        console.log( "user");
       
        localS.authenticate('local',{
            successRedirect:'/dashboard',
            failureRedirect:'/login',
            failureFlash:true
        })(req,res,next);
    
       // console.log("Authenticated by local strategy");
    
    });
    
    //logout
    
    // router.get('/logout',(req,res)=>{
    //     req.logout();
    //     req.flash('success_msg','You are logged out');
    //     res.redirect('/users/login');
    
    // })
    
    
    
    //------------
    

router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    console.log("----------------------------------------------------------------");
    console.log(req.user)
    console.log(req.session)
Story.find({user:req.user.id}).then( stories=>{
    res.render('index/dashboard',{
        stories:stories
    });

} )
  
})



router.get('/register',(req,res)=>{

    res.render('index/register');

})


//register form post
router.post('/register', (req  , res) => {

  //console.log(req);

  console.log("info");
  console.log(req.body);
  console.log(req.body.first_name);

    let errors=[];
 
    if(req.body.password !=req.body.Cpassword){
        errors.push({text:'Password do not match'});
    }
   if(req.body.password.length < 4 ){
       errors.push({text:'Password must be at least 4 characters'});
   }
 
   if(errors.length >0){
       
       res.render('users/register',{
           errors:errors,
           email:req.body.email,
           FirstName:req.body.first_name,
           LastName:req.body.last_name,
           password:req.body.password,
           Cpassword:req.body.Cpassword
       })
   }
 else{
 CUsers.findOne({email:req.body.email})
 .then(user=>{
 
     if(user){
        console.log('email already registred');

         req.flash('error_msg',"Email address already exit");
        
         res.redirect('/register');
     }else{const newUser=new CUsers({
         
         email:req.body.email,
         FirstName:req.body.first_name,
         LastName:req.body.last_name,
         password:req.body.password
     })
     bcrypt.genSalt(10,(err,salt)=>{
 bcrypt.hash(newUser.password,salt,(err,hash)=>{
 if(err) throw err;
 newUser.password=hash;
 
 newUser.save()
 .then(user=>{
     req.flash('success_msg', 'you are now registered and can log in');
     console.log('successful')
     res.redirect('/login');
 })
 .catch(err=>{
     console.log(err);
     return;
 })
 
 });
     })
 }
 
 });
     
 
 }
 
 });

router.get('/about',(req,res)=>{
    res.render('index/about');
    
    })

    router.get('/feedback', ensureAuthenticated,(req,res)=>{

        res.render('index/feedback');
    })

router.post('/feedback',ensureAuthenticated,(req,res)=>{

   
    const newFeedback={
    
        id:req.user.id,
        name:req.body.name,
        email:req.user.email,
        comment:req.body.comment
        
    }
   

new Feedback(newFeedback).save().then(feed=>{

    req.flash('success_msg', 'Feedback submitted successfully !!!');
    res.redirect('/dashboard');

} ).catch(err=>{
    console.log(err);
})

})

router.get('/mail',(req,res)=>{

    res.render('mail',{layout:false});
})



module.exports=router;