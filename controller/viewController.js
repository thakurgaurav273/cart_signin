exports.home = function (req, res) {
    res.render('home');
  };
  
exports.login = function (req, res) {
    res.render('login');
  };
  
exports.register = function (req, res) {
    res.render('register');
  };
  
exports.cart = function (req, res) {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      res.render('cart');
    } else {
      res.redirect('/login');
    }
  };
  