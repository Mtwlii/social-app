import React from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />

      <div className="container w-80% mx-auto  min-h-screen">
        <Outlet />
      </div>

      <Footer />
    </>
  )
};

export default Layout;
