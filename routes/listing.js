const mongoose = require('mongoose');
const express = require("express");
const app = express();
const router = express.Router()
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {listingSchema,reviewSchema}=require("../schema.js")
const Review = require("../models/review.js");
const wrapAsync = require("../utils/WrapAsync.js");
const {isLoggedIn} = require('../middleware.js');


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

  router.get("/", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  });


  router.get("/new",isLoggedIn, (req, res) => {
    
    res.render("listings/new.ejs");
  });
  
  router.get("/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    if(!listing){
      req.flash("error","Listing not exists!")
      res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing });
  });
  
  router.post("/",
    validateListing,isLoggedIn,
    wrapAsync(async (req, res,next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("Done","New Listing Created")
    res.redirect("/listings");
  }));
  
  router.get("/:id/edit",isLoggedIn,wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  }));
  
  router.put("/:id", async (req, res) => {
    let { id } = req.params;
    const { listing } = req.body;
    await Listing.findByIdAndUpdate(id, listing);
    res.redirect(`/listings/${id}`);
  });
  
  router.delete("/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  });
  
  
module.exports = router