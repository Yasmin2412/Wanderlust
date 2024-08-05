const express=require("express");
const router=express.Router();

//error handling for async mongoose error and custom errors 
const asyncWrap=require("../utils/WrapAsync.js");
// const ExpressErr=require("../utilities/expressError.js");

const multer=require("multer");
const {storage}=require("../cloudnairy.js");
const upload=multer({storage});

//middleware require
const {isLoggedIn, isOwner, validateListing}=require("../middleware.js");

//controller require
const listingController = require("../controllers/listings.js");


//routes

router.route("/")
.get(asyncWrap(listingController.index))
.post(isLoggedIn,upload.single("listing[image][url]"),validateListing,asyncWrap(listingController.newListing))

router.get("/new",isLoggedIn,listingController.NewRoute);

router.route("/:id")
.get(asyncWrap(listingController.showRoute))
.put(isLoggedIn,isOwner,upload.single("listing[image][url]"),asyncWrap(listingController.updateRoute))
.delete(isLoggedIn,isOwner,asyncWrap(listingController.deleteRoute))

router.get("/:id/edit",isLoggedIn,isOwner,asyncWrap(listingController.editRoute));


module.exports=router;