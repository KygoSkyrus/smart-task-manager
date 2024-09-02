"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

import { RootState, AppDispatch } from "../../../redux/store";
import {
  appendTaskList,
  deleteTask,
  editTask,
  updateTaskStatus,
} from "../../../redux/tasksSlice";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import Image from "next/image";
import { getPriorityColor } from "@/lib/util";
import Header from "@/components/Header";

const TaskDetailPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // First, try to get the task from Redux
  const taskFromRedux = useSelector((state: RootState) =>
    state.tasks.tasks.find((task) => task.id === id)
  );

  useEffect(() => {
    const fetchTask = async () => {
      // If the task exists in Redux, set it in local state
      if (taskFromRedux) {
        setTask(taskFromRedux);
        setLoading(false);
      } else {
        // Otherwise, fetch the task from Firestore using the ID
        if (id) {
          try {
            const taskDocRef = doc(db, "tasks", id);
            const taskSnapshot = await getDoc(taskDocRef);

            if (taskSnapshot.exists()) {
              setTask({ id: taskSnapshot.id, ...taskSnapshot.data() });
              const tempTask = { id: taskSnapshot.id, ...taskSnapshot.data() };
              dispatch(appendTaskList(tempTask));
            } else {
              toast.error("Task not found.");
              router.push("/"); // Redirect if task not found
            }
          } catch (error) {
            console.error("Error fetching task:", error);
            toast.error("Failed to fetch task.");
          } finally {
            setLoading(false);
          }
        }
      }
    };

    fetchTask();
  }, [id, taskFromRedux, router]);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/task/${task.id}/edit`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      dispatch(deleteTask(task.id));
      toast.success("Task deleted successfully");
      router.push("/");
    } catch (err) {
      console.error("Error deleting task:", err);
      toast.error("Failed to delete task");
    }
  };

  const handleToggle = async () => {
    const newCompletedStatus = !task.completed;
    const copiedTask = { ...task };
    copiedTask["completed"] = newCompletedStatus;

    // Update the task in Redux
    dispatch(updateTaskStatus(copiedTask));

    // Update the task in Firestore
    dispatch(editTask(copiedTask));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading task details...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Task not found</p>
      </div>
    );
  }

  return (
    <>
      <Header title="Task Details" />

      <div className="sm:p-8 p-4 mb-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
          <div className="block rounded-lg lg:col-span-2 p-4 shadow-sm shadow-indigo-100 r">
            <div>
              <section className="font-bold capitalize mb-3 underline">
                {task.title}
              </section>
            </div>

            {task.location?.lat ? (
              <MapContainer
                center={task?.location}
                zoom={13}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker
                  position={task?.location}
                  icon={
                    new Icon({
                      iconUrl: "/marker-icon.png",
                      iconSize: [25, 25],
                      iconAnchor: [12, 41],
                    })
                  }
                />
              </MapContainer>
            ) : (
              <Image
                alt=""
                width={100}
                height={100}
                src="https://images.unsplash.com/photo-1488375634201-b85b28653a79?q=80&w=2029&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="h-56 w-full rounded-md object-cover"
                onClick={() => router.push(`/task/${task.id}`)}
              />
            )}

            <div className="mt-2">
              <div className="mt-4">
                <section className="text-sm text-gray-500">Description</section>
                <section className="mt-2">{task.description}</section>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-lg p-4 shadow-sm shadow-indigo-100">
            <div className="">
              <div className="flex flex-col items-end gap-8 ">
                <div className="flex flex-col items-end">
                  <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
                    <svg
                      fill="#000"
                      width="24px"
                      height="24px"
                      className="size-4 text-indigo-700"
                      viewBox="0 0 0.72 0.72"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.57 0.12h-0.06V0.09a0.03 0.03 0 0 0 -0.06 0v0.03H0.27V0.09a0.03 0.03 0 0 0 -0.06 0v0.03H0.15a0.09 0.09 0 0 0 -0.09 0.09v0.36a0.09 0.09 0 0 0 0.09 0.09h0.42a0.09 0.09 0 0 0 0.09 -0.09V0.21a0.09 0.09 0 0 0 -0.09 -0.09m0.03 0.45a0.03 0.03 0 0 1 -0.03 0.03H0.15a0.03 0.03 0 0 1 -0.03 -0.03v-0.21h0.48Zm0 -0.27H0.12V0.21a0.03 0.03 0 0 1 0.03 -0.03h0.06v0.03a0.03 0.03 0 0 0 0.06 0V0.18h0.18v0.03a0.03 0.03 0 0 0 0.06 0V0.18h0.06a0.03 0.03 0 0 1 0.03 0.03Z"
                        fill="rgb(67 56 202)"
                      />
                    </svg>
                    <p className="text-gray-500 text-xs">Due</p>
                  </div>
                  <p className="font-medium">{task.dueDate}</p>
                </div>

                <div className="flex flex-col items-end">
                  <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.576 1.424a.6.6 0 0 1 .848 0l10.152 10.152a.6.6 0 0 1 0 .848L12.424 22.576a.6.6 0 0 1-.848 0L1.424 12.424a.6.6 0 0 1 0-.848zM12 8v4m0 4.01.01-.011"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke="rgb(67 56 202)"
                      />
                    </svg>

                    <p className="text-gray-500 text-xs">Priority</p>
                  </div>
                  <p
                    className={`${getPriorityColor(task.priority)} font-medium`}
                  >
                    {task.priority}
                  </p>
                </div>

                <div className="flex flex-col items-end text-xs">
                  <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
                    <p className="text-gray-500 text-xs">Status</p>
                  </div>
                  <label
                    htmlFor="completed_toggle"
                    className="inline-flex items-center rounded-lg p-1 my-1 cursor-pointer dark:bg-gray-300 dark:text-gray-100 shadow-sm shadow-indigo-50"
                  >
                    <input
                      id="completed_toggle"
                      type="checkbox"
                      checked={task?.completed}
                      onChange={handleToggle}
                      className="hidden peer"
                    />
                    <span className="rounded-full px-2 py-1 dark:bg-gray-400 peer-checked:dark:bg-gray-300">
                      In Progress
                    </span>
                    <span className="rounded-full px-2 py-1 dark:bg-gray-300 peer-checked:dark:bg-green-600">
                      Completed
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <section
                className="w-full group relative inline-flex items-center justify-center overflow-hidden rounded bg-indigo-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-indigo-500 cursor-pointer"
                onClick={(e) => handleEdit(e)}
              >
                <span className="absolute -end-full transition-all group-hover:end-4">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 0.6 0.6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M.511.172C.469.186.414.13.428.089M.425.092l-.09.09a.3.3 0 0 0-.08.141L.251.34A.007.007 0 0 0 .26.349L.277.345a.3.3 0 0 0 .141-.08l.09-.09A.059.059 0 1 0 .425.092Z"
                      stroke="#fff"
                      stroke-width=".038"
                    />
                    <path
                      d="M.3.075a.3.3 0 0 0-.076.009.19.19 0 0 0-.14.14.3.3 0 0 0 0 .152.19.19 0 0 0 .14.14q.076.018.152 0a.19.19 0 0 0 .14-.14A.3.3 0 0 0 .525.3"
                      stroke="#fff"
                      stroke-width=".038"
                      stroke-linecap="round"
                    />
                  </svg>
                </span>

                <span className="text-sm font-medium transition-all group-hover:me-4">
                  {" "}
                  Update{" "}
                </span>
              </section>

              <section
                className="w-full group relative inline-flex items-center justify-center overflow-hidden rounded border border-current px-8 py-3 text-red-600 focus:outline-none focus:ring active:text-indigo-500 cursor-pointer"
                onClick={(e) => handleDelete(e)}
              >
                <span className="absolute -end-full transition-all group-hover:end-4">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 0.375 0.375"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M.138.025a.013.013 0 0 0 0 .025h.1a.013.013 0 0 0 0-.025zM.075.088A.013.013 0 0 1 .088.075h.2a.013.013 0 0 1 0 .025H.275v.2A.025.025 0 0 1 .25.325H.125A.025.025 0 0 1 .1.3V.1H.087A.013.013 0 0 1 .074.087M.125.1H.25v.2H.125z"
                      fill="#000"
                    />
                  </svg>
                </span>

                <span className="text-sm font-medium transition-all group-hover:me-4">
                  {" "}
                  Delete{" "}
                </span>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskDetailPage;
