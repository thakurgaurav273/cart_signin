require('dotenv').config();
const express=require('express');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const mongoose=require("mongoose");
const session=require('express-session');
const passport=require('passport');
const findOrCreate=require("mongoose-findorcreate");
const passportLocalMongoose=require('passport-local-mongoose');
const routes = require('./routes/index');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User=require("./models/user")

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

app.use('/',routes);
mongoose.set('strictQuery',true);
mongoose.connect(process.env.URL);

passport.use(User.createStrategy());

<<<<<<< HEAD
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
=======
const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    contact:String,
    dob:Date,
    password:String,

});
const saltRounds=10;


const user=new mongoose.model("User",userSchema);
app.get("/",function(req,res){
    res.render("home");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/register",function(request,response){
    bcrypt.hash(request.body.password, saltRounds, function(err, hash) {
        var email=request.body.email_id;
        var user_name=request.body.name;
        var user_dob=request.body.birthday;
        var mob=request.body.mob_number;
        const new_user=new user({
            name:user_name,
            email:email,
            contact:mob,
            dob:user_dob,
            password:hash
        });
        new_user.save();
        response.render("cart",{name:user_name});
>>>>>>> 5722b9562f2d7c79c4051eddccc180cf2d5d4147
    });
  });

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/cart"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({ googleId: profile.id ,username:profile.displayName}, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/cart",
    profileFields: ['id', 'displayName', 'photos', 'email'],
  },
 async function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({ facebookId: profile.id ,
        username:profile.displayName
    }, function (err, user) {
      return cb(err, user);
    });
  }
));

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

app.listen(3000,function(){
    console.log("Server running on port 3000");
});