const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require('method-override');
const wrapAsync = require("./utils/WrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js")
const Review = require("./models/review.js");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));
app.use(express.json());


app.use('/public', express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.send("Hi I am working");
});

app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

app.post("/listings",wrapAsync(async (req, res,next) => {
  
  // let result= listingSchema.validate(req.body);
  // console.log(result);
  // if(result.error){
  //   throw new ExpressError(404,result.error)
  // }
  const { listing } = req.body;
  const newListing = new Listing(listing);
  await newListing.save();
  res.redirect("/listings");
}));

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
app.post('/listings/:id/reviews', async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
});
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
