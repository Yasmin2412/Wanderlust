const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require('method-override');
const wrapAsync = require("./utils/WrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js")
const reviews = require("./models/review.js");
const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const UsersRoute = require("./routes/users.js");
const session = require('express-session')
const flash=require("connect-flash")
const passport=require("passport")
const LocalStrategy=require("passport-local")
const User=require("./models/user.js")

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));
app.use(express.json());

app.use('/public', express.static(path.join(__dirname, 'public')));
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
app.use("/listings",listingRoute)
app.use("/listings/:id/reviews",reviewRoute)
app.use("/",UsersRoute)
 
// Serialize user


const validateListing=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",")
    throw new ExpressError(400,errMsg)
  }else{
    next()
  }
}
const validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",")
    throw new ExpressError(400,errMsg)
  }else{
    next()
  }
}
//  
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate('owner', 'username') // Populate the owner field
    .populate({
      path: 'reviews',
      populate: { path: 'author', select: 'username' } // Populate the author field within reviews
    });
  console.log(listing); // Check the populated listing
  res.render("listings/show.ejs", { listing });
});



app.get("/listings/:id/edit",wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const { listing } = req.body;
  await Listing.findByIdAndUpdate(id, listing);
  res.redirect(`/listings/${id}`);
});

app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});
app.post("/listings/:id/reviews", validateReview ,wrapAsync(async (req, res) => {
  try {
      let listing = await Listing.findById(req.params.id);
      
      if (!listing) {
          return res.status(404).send("Listing not found");
      }

      let newReview = new reviews(req.body.review);
      listing.reviews.push(newReview);

      await newReview.save();
      await listing.save();

      console.log("Listing details after adding new review:", listing);
      console.log("New review details:", newReview);

      res.send("Saved");
  } catch (error) {
      console.error("Error saving review:", error);
      res.status(500).send("Internal Server Error");
  }
}));
//delete reviews
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull :{ reviews: reviewId}})
  await reviews.findByIdAndDelete(reviewId)
  req.flash("error","deleted!")
  res.redirect(`/listings/${id}`);
}))

// Middleware to catch all unmatched routes and create a 404 error
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Error-handling middleware
app.use((err, req, res, next) => {
  // Destructure statusCode and message from the error object
  // Provide default values if they are not set
  let { statusCode = 404, message = "something wrong" } = err;
  
  // Send the error response
  res.status(statusCode).render("listings/error.ejs",{message});

});


const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
main().then(() => {
  console.log("connected to Db ");
}).catch((err) => {
  console.log(err);
});

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
