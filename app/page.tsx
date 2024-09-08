"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Anton } from "next/font/google";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { RootState, AppDispatch } from "../redux/store";
import { setTasks, Task } from "../redux/tasksSlice";
import TaskItem from "../components/TaskItem";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const anton = Anton({ subsets: ["latin"], weight: "400" });

const Home: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [searchQuery, setSearchQuery] = useState("");

  const loading = useSelector((state: RootState) => state.tasks.loading);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "tasks"),
      (snapshot) => {
        const tasksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Task[];

        dispatch(setTasks(tasksData));
      },
      (error) => {
        console.error("Error fetching tasks: ", error);
      }
    );

    // Cleanup on component unmount
    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    setFilteredTasks(tasks); // Update filteredTasks if tasks change
  }, [tasks]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    handleSearch(e.target.value);
  };

  const handleSearch = (query: string) => {
    const filtered = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query.toLowerCase()) ||
        task.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTasks(filtered);
  };

  return (
    <>
      <div className="p-4 m-2 flex flex-col sm:flex-row justify-between items-center shadow-sm shadow-indigo-100 rounded-md">
        <Link href="/">
          <section className={`${anton.className} text-[30px] text-gray-800`}>
            Task Manager
          </section>
        </Link>

        <div className="relative">
          <input
            type="text"
            id="Search"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search tasks..."
            className="w-full min-w-[300px] rounded-md border-gray-200 ps-3 py-2.5 pe-10 shadow-sm sm:text-sm"
          />

          <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
            <button type="button" className="text-gray-600 hover:text-gray-700">
              <span className="sr-only">Search</span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </span>
        </div>
      </div>

      <div className="sm:p-8 p-4 mb-8">
        {/* Floating Navigation Bar */}
        <div className="fixed bottom-4 sm:left-1/2 sm:translate-x-[-50%] rounded-md bg-gray-50 text-white p-2 shadow-lg z-[9999]">
          <div className="">
            <div className="sm:block">
              <nav className="flex gap-6" aria-label="Tabs">
                <Link
                  href="/"
                  className="shrink-0 rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                >
                  Home
                </Link>

                <Link
                  href="/dashboard"
                  className="shrink-0 rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                >
                  Dashboard
                </Link>

                <Link
                  href="/settings"
                  className="shrink-0 rounded-lg bg-sky-100 p-2 text-sm font-medium text-sky-600"
                  aria-current="page"
                >
                  Settings
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Add Task Button */}
        <button
          onClick={() => router.push("/task/add")}
          className="fixed bottom-4 right-4 rounded-md bg-green-500 text-white p-2 shadow-md z-[9999]"
        >
          <svg
            width="30px"
            height="30px"
            viewBox="0 0 0.563 0.563"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0.3 0.103a0.019 0.019 0 0 0 -0.037 0V0.263H0.103a0.019 0.019 0 0 0 0 0.037H0.263v0.159a0.019 0.019 0 0 0 0.037 0V0.3h0.159a0.019 0.019 0 0 0 0 -0.037H0.3z"
              fill="#ffffff"
            />
          </svg>
        </button>

        {/* Task List */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
            {/* <p>Loading tasks...</p> */}
            <div className="h-64 rounded-lg bg-gray-200"></div>
            <div className="h-64 rounded-lg bg-gray-200"></div>
            <div className="h-64 rounded-lg bg-gray-200"></div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <p>No tasks available</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
            {filteredTasks.map((task: Task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
