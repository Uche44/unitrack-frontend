/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Outlet } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import Sidebar from "../components/sidebar";
import { useUserStore } from "../context/user-context";

const SupervisorDashboardLayout: React.FC = () => {
   const user = useUserStore((state) => state.user);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar role={user?.role as any} />

      {/* Main content */}
      <main className="flex-1 p-8 w-full min-h-screen ">
      
        <header
          className="fixed top-0 left-0 w-full z-50 transition-all duration-500 
          bg-white/90 backdrop-blur-md shadow-md flex justify-between items-center
            "
        >
          <div className="max-w-7xl flex items-center justify-between py-4 px-6">
         
            <a
              href="#"
              className="flex items-center gap-2"
            >
              <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                <GraduationCap />
              </div>
              <span className="text-xl font-semibold transition-colors duration-300 text-green-700">
                Unitrack
              </span>
            </a>
          </div>

          {/* profile */}
          <button className="rounded-full bg-green-700 text-white font-bold text-xl h-14 w-14 grid place-content-center mr-4 ">
            {user?.fullname
              ?.trim()
              .split(/\s+/)
              .map((w) => w[0] || "")
              .join("")
              .slice(0, 2)
              .toUpperCase() || ""}
          </button>
        </header>

       
        <Outlet />
      </main>
    </div>
  );
};

export default SupervisorDashboardLayout;
