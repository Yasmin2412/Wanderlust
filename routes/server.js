const express = require("express");
const app = express();
const user=require("./user.js")
const post=require("./post.js")
const session = require('express-session')
const flash = require('connect-flash')
const path = require("path");
// const CookieParser=require("cookie-parser")
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const sessionOption= {
     secret: "mysupersecertstring" ,
     resave:false,
     saveUninitialized  :true
    }

 app.use( session(sessionOption ))
 app.use(flash()) 
 app.use((req,res,next)=>{
    res.locals.msgs=req.flash('registerd')
    next();
 }) 
 
    app.get("/verify",(req,res)=>{
    res.send("Test Successful!")
    })
    app.get("/register",(req,res)=>{
        let { name ="user"}=req.query;
        req.session.name=name;
        req.flash("registerd","User Register Successfully!")
        res.redirect("/hello")
        })
        app.get("/hello",(req,res)=>{
            res.locals.msgs=req.flash('registerd')
            res.render("flash.ejs",{name : req.session.name})
            })

// app.get("/getCookie",(req,res)=>{
//     res.cookie("Cookie!","Girl")
//     res.send("Sent you some Cookie!!!")
// })
// app.get("/singedCookie",(req,res)=>{
//     res.cookie("Made-in","China",{signed:true})
//     res.send("Sent you some  secert Cookie!!!")
// })

// app.get("/",(req,res)=>{
//     console.dir(req.cookies)
//     res.send("I am Cookie Parser!!!")
// })
// app.use("/user",user);
// app.use("/post",post);


app.listen(8080, () => {
    console.log("Server is listening on port 8080");
  });
 
