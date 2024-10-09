import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo_light from "../assets/logo-light.png";
import {
  FaUniversity,
  FaDesktop,
  FaUser,
  FaBox,
  FaWarehouse,
  FaChartLine,
  FaReceipt,
  FaStore,
  FaPeopleCarry,
  FaMapMarkedAlt,
  FaUserShield,
  FaUserCircle,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const linkClasses = ({ isActive }) => {
    return `flex items-center gap-2 h-10 px-2 rounded-md cursor-pointer transition-all duration-200 ${
      isActive
        ? "bg-[#e0f2e9] text-[#067528]"
        : "text-[#f1f1f1] hover:bg-[#e0f2e9] hover:text-black"
    }`;
  };

  const handleDropdownToggle = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={`flex ${
        isSidebarOpen ? "md:w-[20%]" : "w-[60px]"
      } transition-width duration-300`}
    >
      <div className="sidebar flex flex-col gap-3 w-[100%] md:w-[100%] pt-4 px-1 md:px-4 border border-t-0 border-l-0 border-gray-300 bg-white text-[#067528] min-h-screen font-semibold relative">
        {/* Toggle Button */}
        <button
          className="absolute top-4 right-4 text-2xl focus:outline-none"
          onClick={handleSidebarToggle}
        >
          {isSidebarOpen ? <FaAngleLeft /> : <FaAngleRight />}
        </button>

        {/* Logo */}
        <div className={`logo mb-2.5 ${!isSidebarOpen ? "hidden" : ""}`}>
          <NavLink to="/admin">
            <img
              src={logo_light}
              alt="Logo"
              className={`mx-auto ${
                isSidebarOpen ? "w-[70px] md:w-[100px]" : "w-[40px]"
              } h-auto`}
            />
          </NavLink>
        </div>

        <div
          className={`flex flex-col mt-2.5 gap-2 text-xs tracking-wider px-1.5 ${
            !isSidebarOpen && "hidden"
          }`}
        >
          {/* Dashboard */}
          <NavLink className={linkClasses} to="dashboard">
            <FaDesktop className="text-[#067528] w-4 h-4" />
            <span className="text-black text-sm">Dashboards</span>
          </NavLink>

          {/* Users */}
          <NavLink className={linkClasses} to="user">
            <FaUserCircle className="text-[#067528] w-4 h-4" />
            <span className="text-black text-sm">Users</span>
          </NavLink>

          {/* Role */}
          <NavLink className={linkClasses} to="role">
            <FaUserShield className="text-[#067528] w-4 h-4" />
            <span className="text-black text-sm">Role</span>
          </NavLink>

          {/* Land */}
          <NavLink className={linkClasses} to="land">
            <FaMapMarkedAlt className="text-[#067528] w-4 h-4" />
            <span className="text-black text-sm">Land</span>
          </NavLink>

          {/* Haari (Dropdown) */}
          <div className="relative">
            <div
              className={linkClasses({ isActive: false })}
              onClick={() => handleDropdownToggle("haari")}
            >
              <div className="flex items-center justify-between w-full cursor-pointer">
                <div className="flex items-center gap-1 text-[#067528]">
                  <FaUser className="text-[#067528] w-4 h-4" />
                  <span className="text-black text-sm">Haari</span>
                </div>
                <span
                  className={`transition-transform ml-1 text-black duration-300 ${
                    openDropdown === "haari" ? "rotate-180" : "rotate-0"
                  }`}
                >
                  ▼
                </span>
              </div>
            </div>
            {isSidebarOpen && (
              <div
                className={`flex flex-col ml-6 text-center mt-1 gap-1 overflow-hidden transition-max-height duration-300 ease-in-out ${
                  openDropdown === "haari" ? "max-h-40" : "max-h-0"
                }`}
              >
                <NavLink className={linkClasses} to="haari">
                  <span className="text-black md:text-xs">Haari</span>
                </NavLink>
                <NavLink className={linkClasses} to="landxhaari">
                  <span className="text-black md:text-xs">Assign Land</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Vendors */}
          <NavLink className={linkClasses} to="supplier">
            <FaPeopleCarry className="text-[#067528] w-4 h-4" />
            <span className=" text-black text-sm">Vendors</span>
          </NavLink>

          {/* Bank Accounts */}
          <NavLink className={linkClasses} to="bankaccount">
            <FaUniversity className="text-[#067528] w-4 h-4" />
            <span className="text-black text-sm text-nowrap">
              Bank Accounts
            </span>
          </NavLink>

          {/* Store */}
          <NavLink className={linkClasses} to="store">
            <FaStore className="text-[#067528] w-4 h-4" />
            <span className=" text-black text-sm">Store</span>
          </NavLink>

          {/* Items */}
          <NavLink className={linkClasses} to="item">
            <FaBox className="text-[#067528] w-4 h-4" />
            <span className=" text-black text-sm">Items</span>
          </NavLink>

          {/* Stock (Dropdown) */}
          <div className="relative">
            <div
              className={linkClasses({ isActive: false })}
              onClick={() => handleDropdownToggle("stock")}
            >
              <div className="flex items-center justify-between w-full cursor-pointer transition-all">
                <div className="flex items-center gap-2 text-[#067528]">
                  <FaWarehouse className="text-[#067528] w-4 h-4" />
                  <span className="text-black text-sm">Stock</span>
                </div>
                <span
                  className={`transition-transform ml-1 text-black duration-300 ${
                    openDropdown === "stock" ? "rotate-180" : "rotate-0"
                  }`}
                >
                  ▼
                </span>
              </div>
            </div>
            {isSidebarOpen && (
              <div
                className={`flex flex-col ml-6 mt-1 gap-1 text-center overflow-hidden transition-max-height duration-300 ease-in-out ${
                  openDropdown === "stock" ? "max-h-40" : "max-h-0"
                }`}
              >
                <NavLink className={linkClasses} to="stock_consume">
                  <span className="text-black text-xs">Stock Consume</span>
                </NavLink>
                <NavLink className={linkClasses} to="stock_recieve">
                  <span className="text-black text-xs">Stock Recieve</span>
                </NavLink>
              </div>
            )}
          </div>

          <div className="relative">
            <div
              className={linkClasses({ isActive: false })}
              onClick={() => handleDropdownToggle("vouchers")}
            >
              <div className="flex items-center justify-between w-full cursor-pointer transition-all">
                <div className="flex items-center gap-1 text-[#067528]">
                  <FaReceipt className="text-[#067528] w-4 h-4" />
                  <span className="text-black text-sm">Vouchers</span>
                </div>
                <span
                  className={`transition-transform ml-1 text-black duration-300 ${
                    openDropdown === "vouchers" ? "rotate-180" : "rotate-0"
                  }`}
                >
                  ▼
                </span>
              </div>
            </div>
            {isSidebarOpen && (
              <div
                className={`flex flex-col ml-6 mt-1 gap-1 text-center overflow-hidden transition-max-height duration-300 ease-in-out ${
                  openDropdown === "vouchers" ? "max-h-40" : "max-h-0"
                }`}
              >
                <NavLink className={linkClasses} to="journalvoucher">
                  <span className="text-black text-xs">Journal Voucher</span>
                </NavLink>
                <NavLink className={linkClasses} to="paymentvoucher">
                  <span className="text-black text-xs">Payment Voucher</span>
                </NavLink>
                <NavLink className={linkClasses} to="recievevoucher">
                  <span className="text-black text-xs">Recieve Voucher</span>
                </NavLink>
              </div>
            )}
          </div>

        
          <NavLink className={linkClasses} to="chartsofaccounts">
            <FaChartLine className="text-[#067528] w-4 h-4" />
            <span className="text-black text-sm">Charts of Account</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
