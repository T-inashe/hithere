const { hashPassword } = require("../helpers");
const User = require("../models/User");
const SchoolInfo = require("../models/SchoolInfo");

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json("User already exists");

    const hash = await hashPassword(password);
    const newUser = await User.create({ email, password: hash, oauth_provider: "local" });
    await SchoolInfo.create({ email });
    res.json(newUser);
  } catch (error) {
    res.status(500).json("Server error during signup");
  }
};

const getUserData = (req, res) => {
  const userData = req.session.user || (req.user ? [req.user] : null);
  if (!userData) return res.json({ loggedIn: false });

  const formattedUser = {
    loggedIn: true,
    user: userData.map((user) => ({
      id: user._id,
      name: user.name || "",
      email: user.email || "",
      institution: user.institution || "",
      avatar: user.avatar || "",
      role: user.role || "",
    })),
  };
  res.json(formattedUser);
};

module.exports = {
  signup,
  getUserData,
};