const mongoose = require('mongoose');
const express = require("express");
const app = express();
const router = express.Router()
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/WrapAsync.js");
const { isLoggedIn,isOwner,validateListing ,isReviewAuthor} = require('../middleware.js');
const listingController=require("../controllers/listings.js")
const multer  = require('multer')
const {storage}=require("../cloudnairy.js")
const upload = multer({ storage})


router.route("/")
.get(listingController.index)
.post(isLoggedIn,
  upload.single("listing[image][url]"),
  wrapAsync(listingController.newListing))

router.get("/new", isLoggedIn, listingController.NewRoute);

router.route("/:id")
router.get(listingController.showRoute)
.put(isLoggedIn,isOwner,
  upload.single("listing[image][url]"),
  validateListing,listingController.updateRoute)
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteRoute));


router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.editRoute));
module.exports = router