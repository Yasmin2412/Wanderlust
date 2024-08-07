const Listing = require("../models/listing.js");

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    // console.log("hello");
    res.render("listings/index.ejs", { allListings });
  }
  module.exports.NewRoute=(req, res) => {
    res.render("listings/new.ejs");
  }
  module.exports.showRoute=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path :"reviews",populate:{ path : "author"},}).populate("owner")
    if (!listing) {
      req.flash("error", "Listing not exists!")
      res.redirect("/listings")
    }
    // console.log(listing)
    res.render("listings/show.ejs", { listing });
  }
  module.exports.newListing=async (req, res, next) => {
        let url =req.file.path;
        let filename=req.file.filename;
        // console.log(url,"..",filename)
        const newListing = new Listing(req.body.listing);
        newListing.owner=req.user._id;
        newListing.image={url,filename}
        await newListing.save();
        req.flash("Done", "New Listing Created")
        res.redirect("/listings");
      }
  module.exports.editRoute=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    // let oringinalImage=listing.image.url;
    // oringinalImage.replace("/upload","/upload/h_300,w_250,e_b")
    res.render("listings/edit.ejs", { listing });
  }
  module.exports.updateRoute=async (req, res) => {
    let { id } = req.params;
    // console.log(req.body);
    let listing =await Listing.findByIdAndUpdate(id, req.body.listing);
    if(typeof req.file!=="undefined"){
    let url =req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename}
    await listing.save();
    }
   
    req.flash("Done","Listing Updated")
    res.redirect(`/listings/${id}`);
  }
  module.exports.deleteRoute=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("Done","Listing Deleted")
    res.redirect("/listings");
  }