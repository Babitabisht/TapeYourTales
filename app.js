const express = require('express');
const path =require('path');
const exphbs=require('express-handlebars');
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
const passport=require('passport');
const cookieParser =require('cookie-parser');
const session=require('express-session');
const methodOverride=require('method-override');
const flash=require('express-flash');
const mailer=require('express-mailer');
//Handlebars helpers
const{
    truncate,
    stripTags,
    formatDate,
    select,
    editIcon
}=require('./helpers/hbs');
 


//load user model
require('./models/User');
//story model
require('./models/Story');

//feedback model
require('./models/Feedback');

//local strategy model
require('./models/CUser');

//passport config
require('./config/passport')(passport);
require('./config/Cpassport')(passport);



// Load Routes
const auth =require('./routes/auth');
const index =require('./routes/index');
const stories =require('./routes/stories');
const mailOptions=require('./helper/mailer');

//load keys
const keys=require('./config/keys');

//Map global Promises
mongoose.Promise=global.Promise;

//Mongoose Connextion

mongoose.connect(keys.mongoURI).then( ()=>console.log('MongoDB Connected') )
.catch(err=>console.log(err));

const app= express();

//body-parser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); 


//method overriding body parser
app.use(methodOverride('_method'));

//mailer
mailer.extend(app, {
    from: 'Belle Solutions',
    host: 'smtp.gmail.com', 
    secureConnection: true, 
    port: 465, 
    transportMethod: 'SMTP', 
    auth: {
    user: keys.email, 
    pass: keys.pass 
    }
  });

//handlebars
app.engine('handlebars',exphbs({
  helpers:{
    truncate:truncate,
    stripTags:stripTags,
    formatDate:formatDate,
    select:select,
    editIcon:editIcon
  },
  
    defaultLayout:'main'
}));
app.set('view engine','handlebars');


//session
app.use(cookieParser());

app.use(session({
    secret:'secret' ,
    resave:false,
    saveUninitialized:false
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


//flash middleware
app.use(flash());

//set global variables
app.use( (req,res,next)=>{
res.locals.user=req.user || null ;

res.locals.success_msg = req.flash('success_msg');
res.locals.error_msg = req.flash('error_msg');
res.locals.error = req.flash('error');


next();

} )

//set static folder

app.use(express.static(path.join(__dirname,'public')));

//use routes
app.use('/auth',auth);
app.use('/',index);
app.use('/stories',stories);



const port = process.env.PORT || 5000;

app.listen(port,()=>{

    console.log(`Server started on port ${port}`);
});