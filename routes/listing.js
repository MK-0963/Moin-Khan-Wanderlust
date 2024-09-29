const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema ,reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn ,isOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer  = require('multer');
const {storage}= require("../cloudConfig.js");
const upload = multer({ storage });


//chat gpt
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        console.log("Validation Error:", errMsg); // Debugging output
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
  };



  router.route("/")
  .get(wrapAsync (listingController.index))
    .post( isLoggedIn, 
       upload.single ("listing[image]"),
       validateListing,
       wrapAsync(listingController.createListing));

   
//Index Route
// router.get("/",  wrapAsync (listingController.index));
 //New Route
 router.get("/new", isLoggedIn, listingController.renderNewForm
 );

router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put( isLoggedIn, isOwner,  upload.single ("listing[image]"), validateListing,
       wrapAsync(listingController.updateListing))
  .delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)
);


 
  
  //Show Route
//   router.get("/:id",  wrapAsync(listingController.showListing)
// );
  

  // chat gpt create route  Unhide this 
//   router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing)
// );
// router.post( upload.single('listing[iamge]'), (req,res) => {
//   res.send(req.file);
// });
  
  
    //Edit Route
    router.get("/:id/edit",  isLoggedIn, isOwner, wrapAsync (listingController.renderEditForm)
);
    
    // My Update Route
//     router.put("/:id", isLoggedIn, isOwner,  validateListing,
//       wrapAsync(listingController.updateListing)
// );
  
     //chat gpt update route
    // app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    //   console.log("Updating Listing:", req.body.listing); // Debugging output
    //   let { id } = req.params;
    //   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    //   res.redirect(`/listings/${id}`);
    // }));
  
  
//     //Delete Route
//     router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)
// );
  



   
    module.exports = router;