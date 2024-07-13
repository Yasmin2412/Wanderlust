const express = require("express");
const app = express();
const user=require("./user.js")
const post=require("./post.js")
const CookieParser=require("cookie-parser")

app.use(CookieParser("secertcode"))

app.get("/getCookie",(req,res)=>{
    res.cookie("Cookie!","Girl")
    res.send("Sent you some Cookie!!!")
})
app.get("/singedCookie",(req,res)=>{
    res.cookie("Made-in","China",{signed:true})
    res.send("Sent you some  secert Cookie!!!")
})
app.get("/verify",(req,res)=>{
    console.log(req.signedCookies)
})
app.get("/",(req,res)=>{
    console.dir(req.cookies)
    res.send("I am Cookie Parser!!!")
})
app.use("/user",user);
app.use("/post",post);


app.listen(8080, () => {
    console.log("Server is listening on port 8080");
  });
 
