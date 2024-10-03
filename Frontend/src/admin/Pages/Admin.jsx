import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import Dashboard from "./Dashboard";
import User from "./User";
import Role from "./Role";
import Land from "./Land";
import Haari from "./Haari";
import LandxHaari from "./LandxHaari";
import Suppliers from "./Suppliers";
import BankAccounts from "./BankAccounts";
import Store from "./Store";
import Item from "./Item";
import StockConsume from "./StockConsume";
import StockRecieved from "./StockRecieved";
import ChartsofAccounts from "./ChartsofAccounts";

const Admin = () => {
  const [roles, setRoles] = useState([]);
  const handleRolesChange = (newRoles) => {
    setRoles(newRoles);
  };

  return (
    <div className="admin-container flex bg-white text-slate-600 min-h-screen">
      <Sidebar />
      <div className="main-content flex-1 transition-all duration-200 bg-white text-slate-700">
        <Navbar />
        <hr className="border-gray-300" />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user" element={<User roles={roles} />} />
          <Route
            path="/role"
            element={<Role onRolesChange={handleRolesChange} />}
          />
          <Route path="/land" element={<Land />} />
          <Route path="/haari" element={<Haari />} />
          <Route path="/landxhaari" element={<LandxHaari />} />
          <Route path="/supplier" element={<Suppliers />} />
          <Route path="/bankaccount" element={<BankAccounts />} />
          <Route path="/store" element={<Store />} />
          <Route path="/item" element={<Item />} />
          <Route path="/stock_consume" element={<StockConsume />} />
          <Route path="/stock_recieve" element={<StockRecieved />} />
          <Route path="/chartsofaccounts" element={<ChartsofAccounts />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
