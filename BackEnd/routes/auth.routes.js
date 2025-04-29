const express = require("express");
const router = express.Router();
const passport = require("passport");
const { login, logout, googleAuth, googleAuthCallback } = require("../controllers/auth.controller");

router.post("/login", login);
router.post("/logout", logout);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/login` }), googleAuthCallback);

module.exports = router;