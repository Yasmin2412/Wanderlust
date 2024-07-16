const express = require("express");
const app = express();
const router=express.Router()
const User=require("../models/user.js")
const passport = require('passport');
const flash=require("connect-flash")
const bodyParser = require('body-parser');
const wrapAsync = require("../utils/WrapAsync.js");
const LocalStrategy = require('passport-local').Strategy;
// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

router.get("/signup",(req,res)=>{
    res.render("./users/signup.ejs")
})
router.post("/signup", async(req,res)=>{
    try{
        let { username,email,password} =req.body;
    const newUser= new User({email,username});
    const registeredUser=await User.register(newUser,password)
    console.log(registeredUser);
    req.flash("Done","Welcome to Wanderlust")
    res.redirect("/listings")
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }
})
router.get("/login",(req,res)=>{
    res.render("./users/login.ejs")
})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), wrapAsync(async (req, res) => {
    res.send('You Login Successfully');
}));

app.use('/', router);
module.exports=router;