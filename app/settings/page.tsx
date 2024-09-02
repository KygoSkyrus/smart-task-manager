"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import axios from "axios";

import Header from "@/components/Header";
import { AppDispatch } from "../../redux/store";
import { toggleDarkMode } from "../../redux/darkModeSlice";

const TaskDetailPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedTheme);
  }, []);

  const handleToggle = () => {
    dispatch(toggleDarkMode());
  };

  const handleLogout = async (e: React.FormEvent) => {
    const response = await axios.get("/api/auth/logout");
    if (response.status === 200) {
      router.push("/login");
    } else {
        alert("Login failed");
    }
  };

  return (
    <>
      <Header title="Settings" />

      <div className="sm:p-8 p-4 mb-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
          <div className="block rounded-lg lg:col-span-2 p-4 shadow-sm shadow-indigo-100 r">
            {/* <div>
              <section className="font-bold capitalize mb-2 underline">
                Change Theme
              </section>
            </div>

            <div className="mt-4">
              <button
                onClick={handleToggle}
                className="mb-4 p-2 rounded bg-gray-300 text-white"
              >
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </div> */}

            <div className="mt-6">
              <button
                onClick={handleLogout}
                className="mb-4 p-2 rounded bg-red-300 text-white"
              >
                Logout
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default TaskDetailPage;
