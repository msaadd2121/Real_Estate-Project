import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {
    const fetchRentListings = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/getlisting?type=rent&limit=4`
        );

        const data = await res.json();

        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/getlisting?type=sell&limit=4`
        );

        const data = await res.json();

        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRentListings();
  }, []);

  return (
    <div className="w-full overflow-x-hidden">
      {/* Top */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 sm:pt-16 sm:pb-12 md:pt-20 lg:pt-24">
        <div className="flex flex-col gap-4 sm:gap-5">
          <h1 className="text-slate-700 font-bold text-[30px] leading-[1.15] sm:text-4xl sm:leading-tight md:text-5xl lg:text-6xl">
            Find your next{" "}
            <span className="text-slate-500">perfect</span>
            <br />
            place with ease
          </h1>

          <div className="text-gray-400 text-[13px] leading-5 sm:text-sm sm:leading-6 md:text-base max-w-xl">
            Sahand Estate is the best place to find your next perfect place to
            live. We have a wide range of properties for you to choose from.
          </div>

          <Link
            to="/search"
            className="w-fit text-xs sm:text-sm text-blue-800 font-bold hover:underline mt-1"
          >
            Let's get started...
          </Link>
        </div>
      </div>

      {/* Listing results */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="flex flex-col gap-9 sm:gap-12">

          {/* Rent */}
          {rentListings && rentListings.length > 0 && (
            <div className="w-full">
              <div className="flex flex-col gap-1 mb-4">
                <h2 className="text-lg font-semibold text-slate-600 sm:text-2xl md:text-3xl">
                  Recent places for rent
                </h2>

                <Link
                  className="w-fit text-xs sm:text-sm text-blue-800 hover:underline"
                  to="/search?type=rent"
                >
                  Show more places for rent
                </Link>
              </div>

              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4">
                {rentListings.map((listing) => (
                  <ListingItem
                    listing={listing}
                    key={listing._id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sale */}
          {saleListings && saleListings.length > 0 && (
            <div className="w-full">
              <div className="flex flex-col gap-1 mb-4">
                <h2 className="text-lg font-semibold text-slate-600 sm:text-2xl md:text-3xl">
                  Recent places for sale
                </h2>

                <Link
                  className="w-fit text-xs sm:text-sm text-blue-800 hover:underline"
                  to="/search?type=sell"
                >
                  Show more places for sale
                </Link>
              </div>

              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4">
                {saleListings.map((listing) => (
                  <ListingItem
                    listing={listing}
                    key={listing._id}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}