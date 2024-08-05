if(process.env.NODE_ENV!="production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const port = 3000;

//------
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")))
app.use(express.urlencoded({ extended: true }));

//for delete and put request "method-override"
const methodOverride=require("method-override");
app.use(methodOverride("_method"));

//listing routes
const listingsRouter=require("./routes/listing.js");
//review routes
const reviewsRouter=require("./routes/review.js")
//User routes
const usersRouter=require("./routes/users.js");


const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const mongoose = require("mongoose");
main().then(() => {
  console.log("connected to Db ");
}).catch((err) => {
  console.log(err);
});

async function main() {
  await mongoose.connect(MONGO_URL);
}

//----
const engine=require("ejs-mate");
app.engine("ejs",engine);

//passport requiring
const passport=require("passport");
const LocalStrategy=require("passport-local");

//User model require
const User=require("./models/user.js");

//require sessions and flash middleware
const session=require("express-session");
// const MongoStore = require('connect-mongo');
const flash=require("connect-flash");

const ExpressError=require("./utils/ExpressError.js");
const WrapAsync=require("./utils/WrapAsync.js");


const sessionOption= {
  secret: "mysupersecertstring" ,
  resave:false,
  saveUninitialized  :true,
  cookie: {
    expires: Date.now()+7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httOnly : true
  }
 }
 app.get("/", (req, res) => {
  res.send("Hi I am working");
});
app.use( session(sessionOption ))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.Done=req.flash("Done")
  res.locals.error=req.flash("error")
  res.locals.currUser=req.user;
  next()
})

// app.get("/demo",async(req,res)=>{
// let fakeUser=new User({
//   email: "student@gmail.com",
//   username: "delta 3.o"

// })
// let registerUser=await User.register(fakeUser,"Hey")
// res.send(registerUser)
// })
app.use("/listings",listingsRouter)
app.use("/listings/:id/reviews",reviewsRouter)
app.use("/",usersRouter)
 

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});


app.use((err, req, res, next) => {
  // console.log(err.stack);
  let { statusCode = 500, message = "something wrong" } = err;
  res.status(statusCode).render("listings/error.ejs",{message});

});

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
