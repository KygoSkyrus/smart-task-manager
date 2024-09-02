"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import {
  Chart,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";
import dayjs from "dayjs";
import { Pie, Bar, Line } from "react-chartjs-2";
import { AppDispatch, RootState } from "../../redux/store";
import Header from "@/components/Header";
import { setTasks, Task } from "@/redux/tasksSlice";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

Chart.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [priorityData, setPriorityData] = useState<{ [key: string]: number }>({
    Low: 0,
    Medium: 0,
    High: 0,
  });
  const [taskCompletionData, setTaskCompletionData] = useState<number[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [last7Days, setLast7Days] = useState<any[]>([]);

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
    // Calculate the tasks count
    const completed = tasks?.filter((task) => task.completed).length;
    const pending = tasks?.filter((task) => !task.completed).length;
    const priorityCounts = tasks?.reduce(
      (acc, task) => {
        acc[task.priority]++;
        return acc;
      },
      { Low: 0, Medium: 0, High: 0 }
    );

    const today = new Date();
    const upcoming = tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      return dueDate > today;
    });

    setCompletedTasks(completed);
    setPendingTasks(pending);
    setPriorityData(priorityCounts);
    setUpcomingTasks(
      upcoming.sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      )
    );

    // Prepare data for the line chart (last 7 days)
    const tempLast7Days = Array.from({ length: 7 }, (_, i) =>
      dayjs().subtract(i, "day").format("YYYY-MM-DD")
    ).reverse();
    setLast7Days(tempLast7Days);

    const tasksCompletedInLast7Days = last7Days.map(
      (date) =>
        tasks.filter((task) => task.completed && task.dueDate.startsWith(date))
          .length
    );

    setTaskCompletionData(tasksCompletedInLast7Days);
  }, [tasks]);

  const priorityChartData = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        label: "Task Priority",
        data: [priorityData.Low, priorityData.Medium, priorityData.High],
        backgroundColor: ["#36a2eb", "#cc65fe", "#ff6384"],
      },
    ],
  };

  const taskStatusData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        label: "Task Status",
        data: [completedTasks, pendingTasks],
        backgroundColor: ["#36a2eb", "#ff6384"],
      },
    ],
  };

  const lineChartData = {
    labels: last7Days,
    datasets: [
      {
        label: "Tasks Completed",
        data: taskCompletionData,
        fill: false,
        borderColor: "#4caf50",
        tension: 0.1,
      },
    ],
  };

  return (
    <>
      <Header title="Dashboard" showIcon={true} />
      <div className={`sm:p-8 p-4 mb-8`}>
        <div className="grid grid-cols-1 gap-8 sm:gap-4 lg:grid-cols-3 lg:gap-8">
          <div className="shadow-sm shadow-indigo-100 rounded-lg flex flex-col gap-2 p-3">
            <div className="shadow-sm shadow-indigo-100 rounded-lg p-2 px-4 flex justify-center items-center">
              <section>Tasks Stats</section>
            </div>
            <div className="shadow-sm hover:shadow-md shadow-indigo-100 rounded-lg p-2 px-4 flex justify-between items-center text-xs">
              <section>Total Tasks</section>
              <section>
                {priorityData?.Low + priorityData?.Medium + priorityData?.High}
              </section>
            </div>
            <div className="shadow-sm hover:shadow-md shadow-indigo-100 rounded-lg p-2 px-4 flex justify-between items-center text-xs">
              <section>High Priority</section>
              <section>{priorityData?.High}</section>
            </div>
            <div className="shadow-sm hover:shadow-md shadow-indigo-100 rounded-lg p-2 px-4 flex justify-between items-center text-xs">
              <section>Medium Priority</section>
              <section>{priorityData?.Medium}</section>
            </div>
            <div className="shadow-sm hover:shadow-md shadow-indigo-100 rounded-lg p-2 px-4 flex justify-between items-center text-xs">
              <section>Low Priority</section>
              <section>{priorityData?.Low}</section>
            </div>

            <div className="mt-3 flex flex-col gap-2 ">
              <div className="shadow-sm hover:shadow-md shadow-indigo-100 rounded-lg p-2 px-4 flex justify-between items-center text-xs">
                <section>Pending</section>
                <section>{pendingTasks}</section>
              </div>
              <div className="shadow-sm hover:shadow-md shadow-indigo-100 rounded-lg p-2 px-4 flex justify-between items-center text-xs">
                <section>Completed</section>
                <section>{completedTasks}</section>
              </div>
            </div>
          </div>

          <div className="shadow-sm shadow-indigo-100 rounded-lg p-3">
            <div className="chart">
              <h3 className="text-center">Task Priority Distribution</h3>
              <Bar data={priorityChartData} />
            </div>
          </div>

          <div className="shadow-sm shadow-indigo-100 rounded-lg p-3">
            <div className="chart">
              <h3 className="text-center">Task Trends</h3>
              <Line data={lineChartData} />
            </div>
          </div>

          <div className="shadow-sm shadow-indigo-100 rounded-lg p-3">
            <div className="chart">
              <h3 className="text-center">Task Status</h3>
              <Pie data={taskStatusData} />
              <div className="flex items-center gap-2">
                <span className="text-xs">PENDING</span>
                <span className="block w-[10px] h-[10px] pending"></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs">COMPLETED</span>
                <span className="block w-[10px] h-[10px] completed"></span>
              </div>
            </div>
          </div>

          <div className="shadow-sm shadow-indigo-100 rounded-lg flex flex-col gap-2 p-3">
            <div className="shadow-sm shadow-indigo-100 rounded-lg p-2 px-4 flex justify-center items-center">
              <section>Upcoming Tasks</section>
            </div>

            {upcomingTasks.map((task) => (
              <Link
                href={`/task/${task.id}`}
                key={task.id}
                className="shadow-sm hover:shadow-md shadow-indigo-100 rounded-lg p-2 px-4 flex justify-between items-center text-xs"
              >
                <div className="flex items-center gap-2">
                  <section
                    className={`block w-[10px] h-[10px] rounded-full  ${
                      task.priority === "High"
                        ? "completed"
                        : task.priority === "Medium"
                        ? "medium"
                        : "pending"
                    }`}
                  ></section>
                  <section>{task.title}</section>
                </div>
                <section>{new Date(task.dueDate).toLocaleDateString()}</section>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
