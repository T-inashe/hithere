const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const path = require("path");

const app = express();

// Config
const { COOKIE_MAX_AGE } = require("./config/constants");

// Middleware
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

// Database connection
require("./config/database");

// Passport configuration
require("./config/passport");

// Routes
app.use("/", require("./routes"));

module.exports = app;