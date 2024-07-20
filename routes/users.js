const express = require("express");
const app = express();
const router=express.Router()
const User=require("../models/user.js")
const passport = require('passport');
const flash=require("connect-flash")
const wrapAsync = require("../utils/WrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/users.js")


router.route("/signup")
.get(userController.renderSign)
.post( userController.signRoute)

router.route("/login")
.get(userController.renderLogin)
.post( saveRedirectUrl,
  passport.authenticate('local',
  { failureRedirect: '/login',
    failureFlash: true }),
    wrapAsync(userController.loginRoute)) 

router.get("/logout",userController.logOut)
module.exports=router;