const User = require('../model/user');
const passport = require('passport');

exports.register = function (request, response) {
  // Registration logic
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
};

exports.login = function (req, res) {
  // Login logic
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
};

exports.logout = function (req, res) {
  // Logout logic
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
};
