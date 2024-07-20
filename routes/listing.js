const mongoose = require('mongoose');
const express = require("express");
const app = express();
const router = express.Router()
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/WrapAsync.js");
const { isLoggedIn,isOwner,validateListing } = require('../middleware.js');




router.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});
router.get("/new", isLoggedIn, (req, res) => {

  res.render("listings/new.ejs");
});
router.get("/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path :"reviews",populate:{ path : "author"},}).populate("owner")
  if (!listing) {
    req.flash("error", "Listing not exists!")
    res.redirect("/listings")
  }
  console.log(listing)
  res.render("listings/show.ejs", { listing });
});
  
router.post("/",
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("Done", "New Listing Created")
    res.redirect("/listings");
  }));

router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));
router.put("/:id",isLoggedIn,isOwner, validateListing,async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  await Listing.findByIdAndUpdate(id, req.body.listing);
  req.flash("Done","Listing Updated")
  res.redirect(`/listings/${id}`);
});

router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("Done","Listing Deleted")
  res.redirect("/listings");
}));
module.exports = router