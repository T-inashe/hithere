const { comparePassword } = require("../helpers");
const User = require("../models/User");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, oauth_provider: "local" });
    if (!user) return res.json("Fail");

    const isValid = await comparePassword(password, user.password);
    if (isValid) {
      req.session.user = [user];
      req.session.save((err) => {
        if (err) return res.status(500).json("Session error");
        res.json(user);
      });
    } else {
      res.json("Fail");
    }
  } catch (error) {
    res.status(500).json("Login error");
  }
};

const logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Session destroy failed" });
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  });
};

const googleAuthCallback = (req, res) => {
  req.session.user = [req.user];
  res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
};

module.exports = {
  login,
  logout,
  googleAuth,
  googleAuthCallback,
};