// server.js (MongoDB version)
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

// Models
const User = require("./models/User");
const SchoolInfo = require("./models/SchoolInfo");
const Project = require("./models/Project");

const SALT_ROUNDS = 10;
const PORT = process.env.PORT || 8081;
const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000;

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();

app.use(
  cors({
    origin: "https://T-inashe.github.io",
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    key: "email",
    secret: "changetosecureaftertesting",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: new Date(Date.now() + COOKIE_MAX_AGE),
      maxAge: COOKIE_MAX_AGE,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Helper functions
const hashPassword = async (password) => bcrypt.hash(password, SALT_ROUNDS);
const comparePassword = async (password, hash) => bcrypt.compare(password, hash);

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
  try {
    const user = await User.findOne({ email });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8081/auth/google/callback",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        if (!user) {
          const role = req.session?.oauthRole || 'Researcher';

          user = await User.create({
            email,
            name: profile.name.givenName,
            surname: profile.name.familyName,
            password: "google-oauth-user",
            oauth_provider: "google",
            role,
          });
          await SchoolInfo.create({ email });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

const checkAuth = (req, res, next) => {
  if (req.session.user || req.isAuthenticated()) {
    next();
  } else {
    res.json({ loggedIn: false });
  }
};

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
  (req, res) => {
    req.session.user = [req.user];
    res.redirect("http://localhost:5173/dashboard");
  }
);

app.get("/UserData", checkAuth, (req, res) => {
  const userData = req.session.user || (req.user ? [req.user] : null);
  
  if (!userData) {
    return res.json({ loggedIn: false });
  }

  const formattedUser = {
    loggedIn: true,
    user: userData.map(user => ({
      id: user._id,
      name: user.name || '',
      email: user.email || '',
      institution: user.institution || '',
      avatar: user.avatar || '',
      role: user.role || '' 
    }))
  };

  res.json(formattedUser);
});



app.post("/signup", async (req, res) => {
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
});

app.get("/UserData", checkAuth, (req, res) => {
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
    })),
  };
  res.json(formattedUser);
});

app.post("/MainContainer", async (req, res) => {
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
});

app.post("/api/projects/create", checkAuth, async (req, res) => {
  try {
    const userEmail = req.user ? req.user.email : req.session.user[0].email;
    const newProject = await Project.create({ ...req.body, creator_email: userEmail });
    res.json({ success: true, projectId: newProject._id });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating project" });
  }
});

app.get("/api/projects/user", checkAuth, async (req, res) => {
  try {
    const userEmail = req.user ? req.user.email : req.session.user[0].email;
    const projects = await Project.find({ creator_email: userEmail }).sort({ created_at: -1 });
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching projects" });
  }
});

app.get("/api/projects/:id", checkAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.json({ success: false, message: "Project not found" });
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching project details" });
  }
});

app.get("/api/projects", checkAuth, async (req, res) => {
  try {
    const filter = req.query.area ? { research_area: req.query.area } : {};
    const projects = await Project.find(filter).sort({ created_at: -1 });
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching projects" });
  }
});

app.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Session destroy failed" });
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
