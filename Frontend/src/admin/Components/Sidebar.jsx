import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo_light from "../assets/logo-light.png";
import {
  FaUniversity,
  FaDesktop,
  FaUser,
  FaBuilding,
  FaLandmark,
  FaTruck,
  FaBox,
  FaWarehouse,
} from "react-icons/fa";

const Sidebar = () => {
  const [isHaariDropdownOpen, setIsHaariDropdownOpen] = useState(false);
  const linkClasses = ({ isActive }) => {
    return `flex items-center justify-center md:justify-between gap-2 h-8 px-2 rounded-md cursor-pointer transition-all duration-200 ${
      isActive
        ? "bg-[#e0f2e9] text-[#067528]"
        : "text-[#f1f1f1] hover:bg-[#e0f2e9] hover:text-black"
    }`;
  };

  return (
    <div
      className={`sidebar flex flex-col gap-3 pt-[22px] px-3.5 border border-t-0 border-l-0 border-gray-300 bg-white text-[#067528]  min-h-[100vh] md:w-[20%] w-[15%]`}
    >
      <div className="logo mb-2.5">
        <NavLink to="/admin">
          <img
            src={logo_light}
            alt="Logo"
            className="w-[110px] mx-auto hidden md:block"
          />
          <img
            src={logo_light}
            alt="Logo Icon"
            className="w-[50px] mx-auto block md:hidden"
          />
        </NavLink>
      </div>
      <p className="text-[12px] font-[400] hidden md:block tracking-wider text-[#067528] ">
        MENU
      </p>
      <div className="flex flex-col gap-2 text-[10px] tracking-wider px-1.5 py-0.5">
        {/* Dashboard */}
        <NavLink className={linkClasses} to="dashboard">
          <div className="flex items-center gap-2 text-[#067528] ">
            <FaDesktop className="w-[16px] h-[16px] " />
            <span className="text-[14px] tracking-wider font-[500] hidden md:inline-block text-black">
              Dashboards
            </span>
          </div>
        </NavLink>

        {/* Users */}
        <NavLink className={linkClasses} to="user">
          <div className="flex items-center gap-2 text-[#067528]">
            <FaUser className="w-[16px] h-[16px]" />
            <span className="text-[14px] tracking-wider font-[500] hidden md:inline-block text-black">
              Users
            </span>
          </div>
        </NavLink>

        {/* Role */}
        <NavLink className={linkClasses} to="role">
          <div className="flex items-center gap-2  text-[#067528]">
            <FaBuilding className="w-[16px] h-[16px]" />
            <span className="text-[14px] tracking-wider font-[500] hidden md:inline-block text-black">
              Role
            </span>
          </div>
        </NavLink>

        {/* Haari (Dropdown) */}
        <div className="relative">
          <div
            className={linkClasses({ isActive: false })}
            onClick={() => setIsHaariDropdownOpen(!isHaariDropdownOpen)}
          >
            <div className="flex items-center justify-between w-full cursor-pointer">
              <div className="flex items-center gap-2  text-[#067528]">
                <FaUser className="w-[16px] h-[16px]" />
                <span className="text-[14px] tracking-wider font-[500] hidden md:inline-block text-black">
                  Haari
                </span>
              </div>

              <span
                className={`transition-transform ml-20 text-black duration-300 ${
                  isHaariDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                ▼
              </span>
            </div>
          </div>

          {isHaariDropdownOpen && (
            <div className="flex flex-col ml-6 mt-1 gap-1">
              {/* Haari link */}
              <NavLink className={linkClasses} to="haari">
                <span className="text-[14px] tracking-wider font-[500] text-black ">
                  Haari
                </span>
              </NavLink>

              {/* Land with Haari link */}
              <NavLink className={linkClasses} to="landxhaari">
                <span className="text-[14px] tracking-wider font-[500] text-black ">
                  Land with Haari
                </span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Land */}
        <NavLink className={linkClasses} to="land">
          <div className="flex items-center gap-2 text-[#067528]">
            <FaLandmark className="w-[16px] h-[16px]" />
            <span className="text-[14px] tracking-wider font-[500] hidden md:inline-block text-black">
              Land
            </span>
          </div>
        </NavLink>

        {/* Supplier */}
        <NavLink className={linkClasses} to="supplier">
          <div className="flex items-center gap-2 text-[#067528]">
            <FaTruck className="w-[16px] h-[16px]" />
            <span className="text-[14px] tracking-wider font-[500] hidden md:inline-block text-black">
              Vendors
            </span>
          </div>
        </NavLink>

        {/* Bank Accounts */}
        <NavLink className={linkClasses} to="bankaccount">
          <div className="flex items-center gap-2 text-[#067528]">
            <FaUniversity className="w-[16px] h-[16px]" />
            <span className="text-[14px] tracking-wider font-[500] hidden md:inline-block text-black">
              Bank Accounts
            </span>
          </div>
        </NavLink>

        {/* Store */}
        <NavLink className={linkClasses} to="store">
          <div className="flex items-center gap-2 text-[#067528]">
            <FaWarehouse className="w-[16px] h-[16px]" />
            <span className="text-[14px] tracking-wider font-[500] hidden md:inline-block text-black">
              Store
            </span>
          </div>
        </NavLink>

        {/* Items */}
        <NavLink className={linkClasses} to="item">
          <div className="flex items-center gap-2  text-[#067528]">
            <FaBox className="w-[16px] h-[16px]" />
            <span className="text-[14px] tracking-wider font-[500] hidden md:inline-block text-black">
              Items
            </span>
          </div>
        </NavLink>

        <div className="relative">
          <div
            className={linkClasses({ isActive: false })}
            onClick={() => setIsHaariDropdownOpen(!isHaariDropdownOpen)}
          >
            <div className="flex items-center justify-between w-full cursor-pointer transition-all">
              <div className="flex items-center gap-2  text-[#067528]">
                <FaUser className="w-[16px] h-[16px]" />
                <span className="text-[14px] tracking-wider font-[500] hidden md:inline-block text-black">
                  Stock
                </span>
              </div>

              <span
                className={`transition-transform ml-20 text-black duration-300 ${
                  isHaariDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                ▼
              </span>
            </div>
          </div>

          {isHaariDropdownOpen && (
            <div className="flex flex-col ml-6 mt-1 gap-1">
              {/* Haari link */}
              <NavLink className={linkClasses} to="stock_consume">
                <span className="text-[14px] tracking-wider font-[500] text-black ">
                  Stock Consume
                </span>
              </NavLink>

              {/* Land with Haari link */}
              <NavLink className={linkClasses} to="stock_recieve">
                <span className="text-[14px] tracking-wider font-[500] text-black ">
                  Stock Recieve
                </span>
              </NavLink>
            </div>
          )}
        </div>
        <NavLink className={linkClasses} to="chartsofaccounts">
          <div className="flex items-center gap-2 text-[#067528]">
            <FaBox className="w-[16px] h-[16px]" />
            <span className="text-[14px] tracking-wider font-[500] hidden md:inline-block text-black">
              Charts of Accounts
            </span>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
