const express = require("express");
const { ErrorHandler } = require("../util/errorhandler");
const { Listing } = require("../models/listing");
const cloudinary = require("../config/cloudinary");

async function CreateListing(req, res, next) {
  try {
    const listing = await Listing.create(req.body);
    return res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
}

async function uploadImages(req, res, next) {
  try {
    const images = req.files;

    if (!images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload images",
      });
    }

    const uploadedImages = [];

    for (const file of images) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "sahand-estate",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            },
          )
          .end(file.buffer);
      });

      uploadedImages.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    res.status(200).json({
      success: true,
      images: uploadedImages,
    });
  } catch (error) {
    next(error);
  }
}
async function GetUserListing(req, res, next) {
  try {
    if (req.user.id !== req.params.id) {
      return next(new ErrorHandler("You can only view your own listings", 401));
    }

    const listings = await Listing.find({
      userRef: req.params.id,
    });

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
}
async function deleteListing(req, res, next) {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(new ErrorHandler(404, "Listing not found!"));
  }

  if (req.user.id !== listing.userRef) {
    return next(
      new ErrorHandler(401, "You can only delete your own listings!"),
    );
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
}

async function UpdateListing(req, res, next) {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(new ErrorHandler(401, "Listing not found!"));
    }
    if (req.user.id !== listing.userRef) {
      return next(
        new ErrorHandler(401, "You can only update your own listing!"),
      );
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json(updatedListing);
  } catch (error) {
    console.log("UPDATE ERROR:", error);
    next(error);
  }
}
async function GetListing(req, res, next) {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(new ErrorHandler("Listing not found"));
    }

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
}
async function SearchGetListings(req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [true, false] };
    }
    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [true, false] };
    }
    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sell", "rent"] };
    }
    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  CreateListing,
  uploadImages,
  GetUserListing,
  deleteListing,
  UpdateListing,
  GetListing,
  SearchGetListings,
};
