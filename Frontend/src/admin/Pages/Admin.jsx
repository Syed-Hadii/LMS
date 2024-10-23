import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import RecieveForm from "./RecieveVoucherForm";
import JournalForm from "./JournalVoucherForm";
import PaymentForm from "./PaymentVoucherForm";
import PaymentVoucherList from "./PaymentVoucherList";
import RecieveVoucherList from "./RecieveVoucherList";
import JournalVoucherList from "./JournalVoucherList";
import CashAccount from "./CashAccount";
import BankPayDetails from "./BankPayDetails";
import VoucherModal from "../Components/RecieptVoucher";

const Admin = () => {
  return (
    <div className="admin-container flex bg-white text-slate-600 min-h-screen">
      <Sidebar />
      <div className="main-content flex-1 transition-all duration-200 bg-white text-slate-700">
        <Navbar />
        <hr className="border-gray-300" />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user" element={<User />} />
          <Route path="/role" element={<Role />} />
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
          <Route path="/paymentvoucher" element={<PaymentVoucherList />} />
          <Route path="/paymentvoucher/paymentform" element={<PaymentForm />} />
          <Route path="/recievevoucher" element={<RecieveVoucherList />} />
          <Route path="/recievevoucher/recieveform" element={<RecieveForm />} />
          <Route path="/journalvoucher" element={<JournalVoucherList />} />
          <Route path="/journalvoucher/journalform" element={<JournalForm />} />
          <Route path="/cashaccount" element={<CashAccount />} />
          <Route path="/bankpaydetails" element={<BankPayDetails />} />
          <Route path="/voucher" element={<VoucherModal />} />
        </Routes>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Admin;
