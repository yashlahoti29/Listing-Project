const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");



router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
    passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), 
    userController.Login)

router.get("/logout", userController.Logout ); //logout

module.exports = router;

// router.get("/signup",userController.renderSignupForm)

// router.post("/signup", wrapAsync(userController.signup))

//router.get("/login",userController.renderLoginForm)


//router.post("/login",saveRedirectUrl,
    // passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), 
    // userController.Login)