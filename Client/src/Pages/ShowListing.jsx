import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { useSelector } from "react-redux";
import Contact from "../components/Contact"
import {
  FaShare,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
} from "react-icons/fa";
import "swiper/css/bundle";

function ShowListing() {
  SwiperCore.use([Navigation]);

  const { listingId } = useParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);

  const currentUser = useSelector((state) => state.user.currentUser);
  console.log("CURRENT USER:", currentUser);
 console.log("LISTING USER:", listing?.userRef);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(false);

        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/get/${listingId}`,
          {
            withCredentials: true,
          },
        );

        console.log("Listing:", res.data);
        setListing(res.data);
      } catch (error) {
        console.log(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (listingId) {
      fetchListing();
    }
  }, [listingId]);

  return (
    <main className="w-full">
      {/* ================= LOADING ================= */}
      {loading && (
        <p className="text-center my-7 text-xl sm:text-2xl">Loading...</p>
      )}

      {/* ================= ERROR ================= */}
      {error && (
        <p className="text-center my-7 text-xl sm:text-2xl text-red-600">
          Something went wrong!
        </p>
      )}

      {/* ================= LISTING ================= */}
      {listing && !loading && !error && (
        <div className="w-full">
          {/* ================= IMAGE SLIDER ================= */}
          <Swiper navigation modules={[Navigation]} className="w-full">
            {listing.imageUrls?.map((image) => (
              <SwiperSlide key={image.public_id}>
                <div
                  className="
                    w-full
                    h-[250px]
                    sm:h-[350px]
                    md:h-[450px]
                    lg:h-[550px]
                  "
                >
                  <img
                    src={image.url}
                    alt={listing.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* ================= SHARE BUTTON ================= */}
          <div
            className="
              fixed
              top-[10%]
              right-3
              sm:top-[13%]
              sm:right-[3%]
              z-10
              border
              rounded-full
              w-10
              h-10
              sm:w-12
              sm:h-12
              flex
              justify-center
              items-center
              bg-slate-100
              cursor-pointer
              shadow-sm
            "
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);

              setCopied(true);

              setTimeout(() => {
                setCopied(false);
              }, 2000);
            }}
          >
            <FaShare className="text-slate-500 text-sm sm:text-base" />
          </div>

          {/* ================= COPIED MESSAGE ================= */}
          {copied && (
            <p
              className="
                fixed
                top-[17%]
                right-3
                sm:top-[23%]
                sm:right-[5%]
                z-10
                rounded-md
                bg-slate-100
                p-2
                text-xs
                sm:text-sm
                shadow-sm
              "
            >
              Link copied!
            </p>
          )}

          {/* ================= LISTING DETAILS ================= */}
          <div
            className="
              flex
              flex-col
              w-full
              max-w-4xl
              mx-auto
              px-4
              sm:px-6
              md:px-3
              py-3
              my-5
              sm:my-7
              gap-3
              sm:gap-4
            "
          >
            {/* ================= NAME + PRICE ================= */}
            <p
              className="
                text-xl
                sm:text-2xl
                font-semibold
                text-slate-900
                leading-relaxed
              "
            >
              {listing.name} - ${" "}
              {Number(listing.regularPrice).toLocaleString("en-US")}
              {listing.type === "rent" && (
                <span className="text-base sm:text-lg font-normal text-slate-600">
                  {" "}
                  / month
                </span>
              )}
            </p>

            {/* ================= ADDRESS ================= */}
            <p
              className="
                flex
                items-start
                mt-1
                gap-2
                text-slate-600
                text-sm
                sm:text-base
                leading-6
              "
            >
              <FaMapMarkerAlt className="text-green-700 mt-1 shrink-0" />

              <span>{listing.address}</span>
            </p>

            {/* ================= SALE / RENT + DISCOUNT ================= */}
            <div
              className="
                flex
                flex-col
                xs:flex-row
                sm:flex-row
                gap-3
                sm:gap-4
                mt-1
              "
            >
              {/* SALE / RENT */}
              <p
                className="
                  bg-red-900
                  w-full
                  sm:max-w-[200px]
                  text-white
                  text-center
                  p-2
                  rounded-md
                  text-sm
                  sm:text-base
                  font-medium
                "
              >
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>

              {/* DISCOUNT PRICE */}
              <p
                className="
                  bg-green-900
                  w-full
                  sm:max-w-[200px]
                  text-white
                  text-center
                  p-2
                  rounded-md
                  text-sm
                  sm:text-base
                  font-medium
                "
              >
                ${listing.discountedPrice} discount price
              </p>
            </div>

            {/* ================= DESCRIPTION ================= */}
            <p
              className="
                text-slate-800
                text-sm
                sm:text-base
                leading-6
                sm:leading-7
                mt-1
              "
            >
              <span className="font-semibold text-black">Description - </span>

              {listing.description}
            </p>

            {/* ================= FEATURES ================= */}
            <ul
              className="
                text-green-900
                font-semibold
                text-sm
                flex
                flex-wrap
                items-center
                gap-x-4
                gap-y-3
                sm:gap-x-6
                sm:gap-y-4
                mt-1
              "
            >
              {/* BEDROOMS */}
              <li
                className="
                  flex
                  items-center
                  gap-1
                  whitespace-nowrap
                "
              >
                <FaBed className="text-lg" />

                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </li>

              {/* BATHROOMS */}
              <li
                className="
                  flex
                  items-center
                  gap-1
                  whitespace-nowrap
                "
              >
                <FaBath className="text-lg" />

                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths`
                  : `${listing.bathrooms} bath`}
              </li>

              {/* PARKING */}
              <li
                className="
                  flex
                  items-center
                  gap-1
                  whitespace-nowrap
                "
              >
                <FaParking className="text-lg" />

                {listing.parking ? "Parking spot" : "No Parking"}
              </li>

              {/* FURNISHED */}
              <li
                className="
                  flex
                  items-center
                  gap-1
                  whitespace-nowrap
                "
              >
                <FaChair className="text-lg" />

                {listing.furnished ? "Furnished" : "Non Furnished"}
              </li>
            </ul>

            {/* ================= CONTACT LANDLORD ================= */}
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
              >
                Contact landlord
              </button>
            )}

            {/* ================= CONTACT ================= */}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}

export default ShowListing;
