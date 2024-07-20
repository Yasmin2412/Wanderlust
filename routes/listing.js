const mongoose = require('mongoose');
const express = require("express");
const app = express();
const router = express.Router()
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/WrapAsync.js");
const { isLoggedIn,isOwner,validateListing ,isReviewAuthor} = require('../middleware.js');
const listingController=require("../controllers/listings.js")



router.get("/", listingController.index);
router.get("/new", isLoggedIn, listingController.NewRoute);
router.get("/:id",listingController.showRoute);
  
router.post("/",
  isLoggedIn,
  wrapAsync(listingController.newListing));

router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.editRoute));
router.put("/:id",isLoggedIn,isOwner, validateListing,listingController.updateRoute);

router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteRoute));
module.exports = router