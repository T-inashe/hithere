const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middlewares/auth.middleware");
const { signup, getUserData } = require("../controllers/user.controller");

router.post("/signup", signup);
router.get("/UserData", checkAuth, getUserData);

module.exports = router;