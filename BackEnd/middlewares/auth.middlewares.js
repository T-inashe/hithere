const checkAuth = (req, res, next) => {
    if (req.session.user || req.isAuthenticated()) {
      next();
    } else {
      res.json({ loggedIn: false });
    }
  };
  
  module.exports = { checkAuth };