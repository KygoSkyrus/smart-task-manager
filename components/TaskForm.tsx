"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AppDispatch } from "@/redux/store";
import { addTask, editTask } from "../redux/tasksSlice";

const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false });

const TaskForm: React.FC<{ existingTask?: any }> = ({ existingTask }) => {
  const [title, setTitle] = useState(existingTask?.title || "");
  const [description, setDescription] = useState(
    existingTask?.description || ""
  );
  const [dueDate, setDueDate] = useState(existingTask?.dueDate || "");
  const [priority, setPriority] = useState(existingTask?.priority || "Low");
  const [location, setLocation] = useState(existingTask?.location || null);
  const [completed, setCompleted] = useState(existingTask?.completed || false);
  const [loading, setLoading] = useState(false); // Loading state

  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchTask = async () => {
      if (!existingTask && id && typeof id == "string") {
        setLoading(true);
        try {
          const taskDocRef = doc(db, "tasks", id);
          const taskSnapshot = await getDoc(taskDocRef);

          if (taskSnapshot.exists()) {
            const taskData = taskSnapshot.data();
            setTitle(taskData.title);
            setDescription(taskData.description);
            setDueDate(taskData.dueDate);
            setPriority(taskData.priority);
            setLocation(taskData.location);
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
    };

    fetchTask();
  }, [id, existingTask, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const taskId = Array.isArray(id) ? id[0] : id; // Convert to string if it's an array
      const aTask = {
        title,
        description,
        dueDate,
        priority,
        location: {
          lat: location.lat,
          lng: location.lng,
        },
        completed,
      };
      const eTask = {
        id: taskId,
        title,
        description,
        dueDate,
        priority,
        location: {
          lat: location.lat,
          lng: location.lng,
        },
        completed,
      };

      if (existingTask || id) {
        // Update the task
        eTask["id"] = existingTask?.id || id;
        dispatch(editTask(eTask));
        toast.success("Task updated successfully!!!");
      } else {
        // Create a new task
        dispatch(addTask(aTask));
        toast.success("Task created successfully!!!");
      }

      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("");
      setLocation("");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading state
  }

  return (
    <>
      <section className="">
        <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label
              className="relative block rounded-lg border border-gray-200 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              htmlFor="title"
            >
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full peer p-3 border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 text-sm"
                type="text"
              />
              <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                Title
              </span>
            </label>

            <label
              className="relative block rounded-lg border border-gray-200 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              htmlFor="description"
            >
              <textarea
                className="w-full peer p-3 border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 text-sm"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                rows={8}
              ></textarea>
              <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-[10%] peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                Description
              </span>
            </label>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="relative block rounded-lg border border-gray-200 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full p-3 bg-transparent rounded-lg focus:ring-0 text-sm"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                  Priority
                </span>
              </div>

              <label
                className="relative block rounded-lg border border-gray-200 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                htmlFor="date"
              >
                <input
                  className="w-full peer p-3 border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 text-sm"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
                <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                  Date
                </span>
              </label>
            </div>

            <div>
              {(location?.lat || !existingTask || !id) && (
                <MapComponent location={location} setLocation={setLocation} isUserEventsDisabled={false} style={{ height: "400px", width: "100%" }} />
              )}
            </div>

            <button
              type="submit"
              className="group relative items-center justify-center overflow-hidden border border-current px-8 py-3  focus:outline-none focus:ring active:text-indigo-500 inline-block w-full rounded-lg bg-black font-medium text-white sm:w-auto"
            >
              <span className="absolute -end-full transition-all group-hover:end-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 0.72 0.72"
                  xmlns="http://www.w3.org/2000/svg"
                  data-name="Layer 1"
                >
                  <path
                    fill="#fff"
                    d="m.621.279-.18-.18-.01-.006L.42.09H.18a.09.09 0 0 0-.09.09v.36a.09.09 0 0 0 .09.09h.36A.09.09 0 0 0 .63.54V.3A.03.03 0 0 0 .621.279M.27.15h.12v.06H.27Zm.18.42H.27V.48A.03.03 0 0 1 .3.45h.12a.03.03 0 0 1 .03.03ZM.57.54a.03.03 0 0 1-.03.03H.51V.48A.09.09 0 0 0 .42.39H.3a.09.09 0 0 0-.09.09v.09H.18A.03.03 0 0 1 .15.54V.18A.03.03 0 0 1 .18.15h.03v.09a.03.03 0 0 0 .03.03h.18A.03.03 0 0 0 .45.24V.192l.12.12Z"
                  />
                </svg>
              </span>

              <span className="font-medium transition-all group-hover:me-4">
                {" "}
                {existingTask || id ? "Update Task" : "Add New Task"}{" "}
              </span>
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default TaskForm;
