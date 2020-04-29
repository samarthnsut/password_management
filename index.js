const express = require('express');
const port = 8000;
const app = express();
const db = require('./config/mongoose');
const Account = require('./models/account');
const Element = require('./models/element')
const session = require('express-session')
const passport=require('passport')
const cookieParser=require('cookie-parser')
const passportLocal = require('./config/passport-local-stategy')
const flash=require('connect-flash');
const mwares=require('./config/middleware')
app.use(cookieParser())
app.set('view engine', 'ejs');
app.set('views', './views')
app.use(express.urlencoded());
app.use(express.static('assets'));

app.use(session({
    name: 'Password management',
    secret: 'fewifhuiehfcq',
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge: (100*60000*60000)
    }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(passport.setAuthenticatedAccount);

app.use(flash());
app.use(mwares.setflash);

//Starting server at port 8000
app.listen(port, function(err) {
    if (err)
        console.log(`Error in starting server at port: ${port}`);
    else
        console.log(`Server started at: ${port}`);
});

app.get("/", function(req,res){

    return res.render('home')
})
app.get("/signup",function(req,res){
    return res.render('signup')
})

app.post("/new-account",function(req,res){
    
    if(req.body.password!=req.body.confirm_password){
       /* console.log(req.body.password)
        console.log(req.body.Password)
        console.log('password do not match')*/
        req.flash('error','password do not match')
        return res.redirect('back')
    }

    Account.findOne({u_name: req.body.u_name},function(err,account){
        if(err){
            console.log('error in finding user')
            return;
        }
        if(!account){
            Account.create(req.body,function(err,account){
                if(err){
                    console.log('error in creating user',err)
                      return;
                }

                return res.redirect('/')
            })
        }else{
            console.log('user already exist')
            req.flash('error','user already exist')
            return res.redirect('back')
        }
        
    })
   
})

app.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect: '/'}
),function(req,res){
    req.flash('success','logged in successfully')
    res.redirect('/userpage')
})

app.get('/userpage',passport.checkAuthentication,function(req,res){
    Element.find({},function(err,elements){
        return res.render('userpage',{
            elements : elements
        })
    })
   
})

app.get('/sign-out',function(req,res){
    req.logOut()
    req.flash('success','logged out successfully')
    return res.redirect('/')
})
app.post('/create-new',function(req,res){
    Element.create({
         title : req.body.title,
         pass : req.body.pass,
         account: req.user._id
    },function(err,element){
        if(err)
        {
            console.log("error in creating element",err)
        }
       req.flash('success', 'password added successfully to database')
        return res.redirect('back')
    })
})
app.get('/delete/:id',passport.checkAuthentication,function(req,res){
    Element.findById(req.params.id,function(err,element){
        element.remove();
        return res.redirect('back')
    })
})
app.post('/update/:id',passport.checkAuthentication,function(req,res){
    
    Element.findByIdAndUpdate(req.params.id,req.body,function(err,element){
        req.flash('success','password updated successfully')
        return res.redirect('back')
    })
})