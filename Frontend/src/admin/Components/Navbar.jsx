import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import profile from "../assets/profile.avif";
import { FaShoppingCart, FaBell, FaCog } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

const Navbar = () => {
  const cartItems = 3;
  const notifications = 1;
  const userName = "Syed A. Hadi";
  const navigate = useNavigate();

  const [hasShadow, setHasShadow] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hideDropdownTimeout, setHideDropdownTimeout] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setHasShadow(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setShowDropdown(false);
    navigate("/");
  };

  const handleDelayedHide = () => {
    const timeout = setTimeout(() => setShowDropdown(false), 300);
    setHideDropdownTimeout(timeout);
  };

  const handleCancelHide = () => {
    if (hideDropdownTimeout) {
      clearTimeout(hideDropdownTimeout);
    }
    setHideDropdownTimeout(null);
    setShowDropdown(true);
  };

  return (
    <div
      className={`navbar px-3 py-4 sticky top-0 transition-shadow duration-300 bg-white text-[#067528] ${
        hasShadow ? "shadow-[0_2px_4px_rgba(0,0,0,0.1)]" : ""
      }`}
    >
      <div className="container flex justify-between items-center">
        <div className="search hidden md:flex border border-[#cfd1d0] focus-within:outline focus-within:outline-[#a8aaa8] focus-within:outline-1 rounded-[4px] py ml-14">
          <button className="border-r-white bg-white rounded-l-md pl-2 pr-1.5 py-1 ">
            <FiSearch className="w-[17px] h-[17px] text-[#808180]" />
          </button>
          <input
            type="text"
            placeholder="Search for ..."
            className="border-l-white text-[14px] outline-none rounded-r-md w-[275px] px-1 py-[7px]"
          />
        </div>

        <div className="nav-items flex items-center justify-end w-full gap-3 md:w-56 md:justify-between">
          <NavLink className="nav-link  hover:text-black w-10 h-8 flex items-center justify-center rounded-md transition-all duration-300 relative">
            <FaShoppingCart className="w-[17px] h-[17px] text-[#067528] hover:text-black transition-all" />
            {cartItems > 0 && (
              <span className="absolute -top-[2px] right-[1px] bg-red-400 text-white text-[9px] font-bold rounded-full px-[4px]">
                {cartItems}
              </span>
            )}
          </NavLink>

          <NavLink className="nav-link   w-10 h-8 flex items-center justify-center rounded-md transition-all duration-300 relative">
            <FaBell className="w-[17px] h-[17px] text-[#067528] hover:text-black transition-all" />
            {notifications > 0 && (
              <span className="absolute top-1 right-2 bg-blue-500 rounded-full w-1.5 h-1.5 blinking"></span>
            )}
          </NavLink>
          <NavLink className="nav-link  w-10 h-8  items-center justify-center rounded-md transition-all duration-300 relative hidden md:flex">
            <FaCog className="w-[17px] h-[17px] text-[#067528] hover:text-black transition-all" />
          </NavLink>
          <div
            className="relative"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={handleDelayedHide}
          >
            <NavLink className="nav-link">
              <img
                src={profile}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer"
              />
            </NavLink>

            {showDropdown && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white border  rounded-lg shadow-lg py-2 z-50"
                onMouseEnter={handleCancelHide}
                onMouseLeave={handleDelayedHide}
              >
                <p className="px-4 py-2 text-sm text-[#067528] border-b">
                  {userName}
                </p>
                <div className="flex flex-col items-start md:hidden">
                  <NavLink className="nav-link w-full px-4 py-2 text-left text-sm text-[#067528] hover:bg-[#067528] hover:text-white">
                    <FaCog className="inline-block w-[17px] h-[17px] mr-2" />
                    Settings
                  </NavLink>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-[#067528] hover:bg-[#067528] hover:text-white transition-all"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
