import React from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false });

import {
  Task,
  deleteTask,
  editTask,
  updateTaskStatus,
} from "../redux/tasksSlice";
import { AppDispatch, RootState } from "../redux/store";
import { getPriorityColor } from "@/lib/util";

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    priority: "Low" | "Medium" | "High";
    location: {
      lat: number;
      lng: number;
    };
    completed: boolean;
  };
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the event from bubbling up to the parent
    dispatch(deleteTask(task.id));
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    router.push(`/task/${task.id}/edit`);
  };

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();

    const newCompletedStatus = !task.completed;
    const copiedTask = { ...task };
    copiedTask["completed"] = newCompletedStatus;

    // Update the task status in Redux
    dispatch(updateTaskStatus(copiedTask));

    // Update the task in Firestore
    dispatch(editTask(copiedTask));
  };

  return (
    <div className="block rounded-lg p-4 shadow-sm hover:shadow-md shadow-indigo-100 cursor-pointer">
      {task.location?.lat ? (
        <MapComponent
          location={task.location}
          // setLocation={task.location}
          isUserEventsDisabled={true}
          style={{ height: "224px", width: "100%", borderRadius: "8px" }}
        />
      ) : (
        <Image
          alt=""
          width={100}
          height={100}
          src="https://images.unsplash.com/photo-1488375634201-b85b28653a79?q=80&w=2029&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          className="h-56 w-full rounded-md object-cover"
          onClick={() => router.push(`/task/${task.id}`)}
          unoptimized
        />
      )}
      <div className="mt-2">
        <div className="flex justify-between">
          <Link href={`/task/${task.id}`} className="flex items-center">
            <section>
              <section className="font-medium capitalize">{task.title}</section>
            </section>
            {task?.completed && (
              <div>
                <dd className="ms-2 text-green-500 uppercase text-xs font-semibold">
                  Completed
                </dd>
              </div>
            )}
          </Link>
          <div className="flex gap-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task?.completed}
                onChange={(e) => handleToggle(e)}
                title="Mark Completed"
                className="size-4 rounded border-gray-300 cursor-pointer"
              />
            </div>

            <div
              className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2"
              onClick={(e) => handleEdit(e)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 0.6 0.6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M.511.172C.469.186.414.13.428.089M.425.092l-.09.09a.3.3 0 0 0-.08.141L.251.34A.007.007 0 0 0 .26.349L.277.345a.3.3 0 0 0 .141-.08l.09-.09A.059.059 0 1 0 .425.092Z"
                  stroke="#363853"
                  stroke-width=".038"
                />
                <path
                  d="M.3.075a.3.3 0 0 0-.076.009.19.19 0 0 0-.14.14.3.3 0 0 0 0 .152.19.19 0 0 0 .14.14q.076.018.152 0a.19.19 0 0 0 .14-.14A.3.3 0 0 0 .525.3"
                  stroke="#363853"
                  stroke-width=".038"
                  stroke-linecap="round"
                />
              </svg>
            </div>

            <div
              className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2"
              onClick={(e) => handleDelete(e)}
            >
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
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs flex justify-between">
          <Link href={`/task/${task.id}`} className="flex items-center gap-8 ">
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

              <div className="mt-1.5 sm:mt-0">
                <p className="text-gray-500">Due</p>
                <p className="font-medium">{task.dueDate}</p>
              </div>
            </div>

            <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
              <svg
                width="16"
                height="16"
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

              <div className="mt-1.5 sm:mt-0">
                <p className="text-gray-500">Priority</p>
                <p
                  className={`${getPriorityColor(task.priority)}  font-medium`}
                >
                  {task.priority}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
