import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    type: "rent",
    parking: false,
    furnished: false,
    offer: false,
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountedPrice: 50,
  });
  console.log(formData);

  const { listingId } = useParams();
  const [images, setImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
  console.log("USE EFFECT RUN");
  console.log("Listing ID:", listingId);

  const fetchListing = async () => {
    console.log("FETCH START");

    try {
      const res = await axios.get(
        `http://localhost:5000/api/get/${listingId}`,
        {
          withCredentials: true,
        }
      );

      console.log("API DATA:", res.data);

      setFormData(res.data);
      setUploadedImages(res.data.imageUrls || []);
    } catch (error) {
      console.log("API ERROR:", error);
    }
  };

  if (listingId) {
    fetchListing();
  }
}, [listingId]);
  // Image select
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 6) {
      setError("You can only select 6 images per listing");
      setMessage("");
      return;
    }

    setImages(files);
    setError("");
    setMessage("");
  };

  // Image upload
  const handleUpload = async () => {
    if (images.length === 0) {
      setError("Please select images first");
      setMessage("");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setMessage("");

      const imageData = new FormData();

      images.forEach((image) => {
        imageData.append("images", image);
      });

      const response = await axios.post(
        "http://localhost:5000/api/upload-images",
        imageData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // Purani uploaded images ko rakh kar new images add karo
      setUploadedImages([...uploadedImages, ...response.data.images]);

      setMessage("Images uploaded successfully");
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Images upload failed");
      setMessage("");
    } finally {
      setUploading(false);
    }
  };
  // Form fields
  const handleChange = (e) => {
    if (e.target.id === "sell" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.id === "name" ||
      e.target.id === "description" ||
      e.target.id === "address"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }

    if (
      e.target.id === "bedrooms" ||
      e.target.id === "bathrooms" ||
      e.target.id === "regularPrice" ||
      e.target.id === "discountedPrice"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: Number(e.target.value),
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploadedImages.length === 0) {
      setError("Please upload at least one image");
      setMessage("");
      return;
    }
    if (formData.regularPrice < formData.discountedPrice) {
      return setError("Discounted Price must be Lower than Regular Price");
    }

    try {
      setError("");
      setMessage("");

      const listingData = {
        ...formData,
        imageUrls: uploadedImages,
        userRef: currentUser._id,
      };

      const response = await axios.post(
        `http://localhost:5000/api/updatelisting/${listingId}`,
        listingData,
        {
          withCredentials: true,
        },
      );

      console.log("Update listing:", response.data);

      setMessage("Listing Updated successfully!");
      setError("");
      navigate(`/listing/${response.data._id}`);
    } catch (error) {
      console.log("ERROR:", error.response?.data);

      setError(error.response?.data?.message || "Failed to Update listing");
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <h1 className="text-center text-3xl font-bold text-slate-800 mb-8">
        Update a Listing
      </h1>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT SIDE */}
          <div className="space-y-4">
            {/* Name */}
            <input
              type="text"
              id="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-md bg-white p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Description */}
            <textarea
              id="description"
              placeholder="Description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full rounded-md bg-white p-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Address */}
            <input
              type="text"
              id="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full rounded-md bg-white p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-4 text-sm text-slate-700">
              {/* Sell */}
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  id="sell"
                  checked={formData.type === "sell"}
                  onChange={handleChange}
                />
                Sell
              </label>

              {/* Rent */}
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  id="rent"
                  checked={formData.type === "rent"}
                  onChange={handleChange}
                />
                Rent
              </label>

              {/* Parking */}
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  id="parking"
                  checked={formData.parking}
                  onChange={handleChange}
                />
                Parking spot
              </label>

              {/* Furnished */}
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  id="furnished"
                  checked={formData.furnished}
                  onChange={handleChange}
                />
                Furnished
              </label>

              {/* Offer */}
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  id="offer"
                  checked={formData.offer}
                  onChange={handleChange}
                />
                Offer
              </label>
            </div>

            {/* Beds & Baths */}
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="15"
                value={formData.bedrooms}
                onChange={handleChange}
                required
                className="w-20 rounded-md bg-white p-3 outline-none"
              />

              <span>Beds</span>

              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                value={formData.bathrooms}
                onChange={handleChange}
                required
                className="w-20 rounded-md bg-white p-3 outline-none"
              />

              <span>Baths</span>
            </div>

            {/* Price */}
            <div className="flex flex-wrap gap-3">
              {/* Regular Price */}
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  id="regularPrice"
                  min="0"
                  required
                  value={formData.regularPrice}
                  onChange={handleChange}
                  className="w-24 rounded-md bg-white p-3 outline-none"
                />

                <div className="text-sm">
                  <p>Regular price</p>
                  {formData.type === "rent" && (
                    <p className="text-xs">($ / Month)</p>
                  )}
                </div>
              </div>

              {/* Discounted Price */}
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  id="discountedPrice"
                  min="0"
                  required
                  value={formData.discountedPrice}
                  onChange={handleChange}
                  className="w-24 rounded-md bg-white p-3 outline-none"
                />

                <div className="text-sm">
                  <p>Discounted price</p>
                  {formData.type === "rent" && (
                    <p className="text-xs">($ / Month)</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-4">
            {/* Images */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Images:
                <span className="font-normal">
                  {" "}
                  The first image will be the cover (max 6)
                </span>
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border rounded-md bg-white p-2 text-sm"
                />

                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading}
                  className="border border-slate-600 text-slate-600 px-5 py-2 rounded-md font-semibold hover:bg-slate-700 hover:text-white transition disabled:opacity-50"
                >
                  {uploading ? "UPLOADING..." : "UPLOAD"}
                </button>
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-600 text-sm mt-2 font-medium">{error}</p>
              )}

              {/* Success */}
              {message && (
                <p className="text-green-600 text-sm mt-2 font-medium">
                  {message}
                </p>
              )}

              {/* Image Preview */}
              <div className="mt-4 space-y-3">
                {uploadedImages.map((image, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-3"
                  >
                    <img
                      src={image.url}
                      alt={`uploaded-${index}`}
                      className="w-16 h-12 object-cover rounded-md"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        setUploadedImages(
                          uploadedImages.filter((_, i) => i !== index),
                        );
                      }}
                      className="text-red-600 text-sm font-semibold"
                    >
                      DELETE
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Listing */}
            <button
              type="submit"
              className="w-full h-11 bg-slate-700 text-white rounded-md font-semibold hover:bg-slate-800 transition"
            >
              UPDATE LISTING
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
