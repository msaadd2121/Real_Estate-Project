const express = require("express");
const { AuthenticatedUser } = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  CreateListing,
  uploadImages,
  GetUserListing,
  deleteListing,
  UpdateListing,
  GetListing,
  SearchGetListings,
} = require("../controllers/listing");
const router = express.Router();

router.post("/createlisting", AuthenticatedUser, CreateListing);
router.post("/upload-images", upload.array("images", 6), uploadImages);
router.get("/listings/:id", AuthenticatedUser,GetUserListing);
router.delete("/delete/:id", AuthenticatedUser, deleteListing);
router.post("/updateListing/:id", AuthenticatedUser, UpdateListing);
router.get('/get/:id', GetListing)
router.get('/getlisting',SearchGetListings)
module.exports = router;
