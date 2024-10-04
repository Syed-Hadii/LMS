import React from "react";
import { FaChevronRight } from "react-icons/fa";
import users from "../assets/users.png";
import session from "../assets/session.png";
import rate from "../assets/rate.png";
import duration from "../assets/duration.png";

const Dashboard = () => {
  return (
    <div className="py-3 px-4">
      <div className="flex flex-col md:flex-row justify-between font-[600]">
        <h2 className="text-[17px] md:text-[20px] text-gray-700">Analytics</h2>
        <div className="flex text-[13px] md:text-[14px] items-center gap-1 mt-2 md:mt-0">
          <span className="text-gray-400">Dashboard</span>{" "}
          <FaChevronRight className="text-gray-400 text-[7px] md:text-[10px] mr-1" />
          <span className="text-gray-600">Analytics</span>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="flex flex-wrap gap-6 mt-4">
        <div className="w-full sm:w-[48%] lg:w-[225px] rounded-[4px] bg-emerald-100 text-white h-[160px] border p-4 py-5 space-y-3 shadow-sm">
          <img src={users} className="rounded-md w-12" alt="Users" />
          <p className="text-gray-800 text-lg font-[500]">15,876</p>
          <p className="text-gray-500 text-[16px]">Total Users</p>
        </div>

        <div className="w-full sm:w-[48%] lg:w-[225px] rounded-[4px] bg-orange-100 text-white h-[160px] border p-4 py-5 space-y-3 shadow-sm">
          <img src={session} className="rounded-md w-12" alt="Sessions" />
          <p className="text-gray-800 font-[500] text-lg">103.15k</p>
          <p className="text-gray-500 text-[16px]">Sessions</p>
        </div>

        <div className="w-full sm:w-[48%] lg:w-[225px] rounded-[4px] bg-blue-100 text-white h-[160px] border p-4 py-5 space-y-3 shadow-sm">
          <img src={rate} className="rounded-md w-12" alt="Rate" />
          <p className="text-gray-800 font-[500] text-lg">1M 29sec</p>
          <p className="text-gray-500 text-[16px]">Avg. Visit Duration</p>
        </div>

        <div className="w-full sm:w-[48%] lg:w-[225px] rounded-[4px] bg-purple-100 text-white h-[160px] border p-4 py-5 space-y-3 shadow-sm">
          <img src={duration} className="rounded-md w-12" alt="Duration" />
          <p className="text-gray-800 font-[500] text-lg">49.77%</p>
          <p className="text-gray-500 text-[16px]">Bounce Rate</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
