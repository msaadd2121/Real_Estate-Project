import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin";
import Header from "./components/Header";
import Profile from "./Pages/Profile";
import PrivateRoute from "./components/privateRoute";
import CreateListing from "./Pages/CreateListing";
import UpdateListing from "./Pages/UpdateListing";
import ShowListing from "./Pages/ShowListing";
import Search from "./Pages/Search";
import Footer from "./components/Footer"

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/sign-up" element={<Signup />}></Route>
          <Route path="/sign-in" element={<Signin />}></Route>
          <Route path="/listing/:listingId" element={<ShowListing/>}></Route>
          <Route path="/search" element={<Search/>}></Route>
          <Route element={<PrivateRoute/>}>
          <Route path="/profile" element={<Profile/>}></Route>
          <Route path="/create-listing" element={<CreateListing/>}></Route>
          <Route path="/update-listing/:listingId" element={<UpdateListing/>}></Route>
          </Route>

        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
