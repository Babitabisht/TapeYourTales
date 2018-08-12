const express =require('express');
const router= express.Router();
const mongoose=require('mongoose');
const  Story=mongoose.model('stories');
const {ensureAuthenticated,ensureGuest}=require('../helper/auth');
const Feedback=mongoose.model('feedback');



router.get('/',ensureGuest,(req, res)=>{
    res.render('index/welcome');
});


router.get('/dashboard',ensureAuthenticated,(req,res)=>{
Story.find({user:req.user.id}).then( stories=>{
    res.render('index/dashboard',{
        stories:stories
    });

} )
  
})

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