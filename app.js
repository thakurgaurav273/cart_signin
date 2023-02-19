require('dotenv').config();
const express=require('express');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const mongoose=require("mongoose");
const session=require('express-session');
const passport=require('passport');
const findOrCreate=require("mongoose-findorcreate");
const passportLocalMongoose=require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;


const app=express();
app.set("view engine","ejs");

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:false}));

app.use(session({
  secret: 'Our little secret',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

mongoose.set('strictQuery',true);
mongoose.connect(process.env.URL);


const userSchema=new mongoose.Schema({
    googleId:String,
    username:String,
    password:String,
    facebookId:String

});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);



const User=new mongoose.model("User",userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/cart"
  },
  function(accessToken, refreshToken, profile, cb) {
//     console.log(profile);
//   save the username id recieved to the db
    User.findOrCreate({ googleId: profile.id ,username:profile.displayName}, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/cart",
  },
 async function(accessToken, refreshToken, profile, cb) {
//     console.log(profile);
//   saved the profile details like username and fb_id to the db 
    User.findOrCreate({ facebookId: profile.id ,
        username:profile.displayName
    }, function (err, user) {
      return cb(err, user);
    });
  }
));

// route for authentication via fb
app.get('/auth/facebook',
  passport.authenticate('facebook',{scope:'email'}));

app.get('/auth/facebook/cart',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/cart');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/cart', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/cart');
  });


  
app.get("/",function(req,res){
    res.render("home");
}); 

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

// route for the cart page to validate user
app.get("/cart",function(req,res){
    console.log(req.isAuthenticated());
    if(req.isAuthenticated()){
        res.render("cart");
    }
    else{
        res.redirect("/login");
    }
});

app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

// normal registeration via username or email and password and save to db 
app.post("/register",function(request,response){
    User.register({username:request.body.username},request.body.password,function(err,user){
        if(err){
            console.log(err);
            response.redirect("/register");
        }
        else{
            passport.authenticate("local")(request,response,function(){
                response.redirect("/cart");
            });
        }
    })
});

app.post("/login",function(request,response){
    const newUser=new User({
        username:request.body.username,
        password:request.body.password
    })
    request.login(newUser,function(err){
        if(err){
            console.log(err);

        }
        else{
            passport.authenticate("local")(request,response,function(){
                response.redirect("/cart");
            })
        }
    })

})


app.listen(3000,function(){
    console.log("Server running on port 3000");
});
