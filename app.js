
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
const User=require("./model/user");

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