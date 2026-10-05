import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

function Search() {
  const [Sidebar, setSideBar] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    sort: "createdAt",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Handle sidebar changes
  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sell"
    ) {
      setSideBar({
        ...Sidebar,
        type: e.target.id,
      });
    }

    if (e.target.id === "searchTerm") {
      setSideBar({
        ...Sidebar,
        searchTerm: e.target.value,
      });
    }

    if (e.target.id === "parking" || e.target.id === "furnished") {
      setSideBar({
        ...Sidebar,
        [e.target.id]: e.target.checked,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "desc";

      setSideBar({
        ...Sidebar,
        sort,
        order,
      });
    }
  };

  // Search submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();

    urlParams.set("searchTerm", Sidebar.searchTerm);
    urlParams.set("type", Sidebar.type);
    urlParams.set("parking", Sidebar.parking);
    urlParams.set("furnished", Sidebar.furnished);
    urlParams.set("sort", Sidebar.sort);
    urlParams.set("order", Sidebar.order);

    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  };

  // Fetch listings
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSideBar({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true",
        furnished: furnishedFromUrl === "true",
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      try {
        setLoading(true);

        // First page
        urlParams.set("startIndex", 0);
        urlParams.set("limit", 9);

        const searchQuery = urlParams.toString();

        const res = await fetch(
          `http://localhost:5000/api/getlisting?${searchQuery}`,
        );

        const data = await res.json();

        setListings(data);

        // Agar 9 listings aayi hain to aur listings ho sakti hain
        if (data.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  // Show More
  const OnShowMoreClick = async () => {
    try {
      const numberofListings = listings.length;

      const startIndex = numberofListings;

      const urlParams = new URLSearchParams(location.search);

      urlParams.set("startIndex", startIndex);
      urlParams.set("limit", 9);

      const searchQuery = urlParams.toString();

      const res = await fetch(
        `http://localhost:5000/api/getlisting?${searchQuery}`,
      );

      const data = await res.json();

      // Purani + new listings
      setListings((prev) => [...prev, ...data]);

      // Agar 9 se kam aayi hain to aur data nahi hai
      if (data.length < 9) {
        setShowMore(false);
      } else {
        setShowMore(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Search */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>

            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={Sidebar.searchTerm}
              onChange={handleChange}
            />
          </div>

          {/* Type */}
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={Sidebar.type === "all"}
              />
              <span>Rent & Sale</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={Sidebar.type === "rent"}
              />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sell"
                className="w-5"
                onChange={handleChange}
                checked={Sidebar.type === "sell"}
              />
              <span>Sell</span>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={Sidebar.parking}
              />
              <span>Parking</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={Sidebar.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>

            <select
              onChange={handleChange}
              defaultValue="createdAt_desc"
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="regularPrice_desc">Price high to low</option>

              <option value="regularPrice_asc">Price low to high</option>

              <option value="createdAt_desc">Latest</option>

              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results */}
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results:
        </h1>

        <div className="p-7">
          {/* No listing */}
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">No listing found!</p>
          )}

          {/* Loading */}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}

          {/* Listing Cards */}
          {!loading && listings.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          )}

          {/* Show More */}
          {showMore && (
            <button
              onClick={OnShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full cursor-pointer"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
