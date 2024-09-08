// components/EditTaskPageClient.tsx
"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import TaskForm from "@/components/TaskForm";
import Header from "@/components/Header";

interface EditTaskPageProps {
  id: string;
}

const EditTaskPageClient: React.FC<EditTaskPageProps> = ({ id }) => {
  const task = useSelector((state: RootState) =>
    state.tasks.tasks.find((task) => task.id === id)
  );

  return (
    <>
      <Header title="Edit Task" />
      <div className="sm:p-8 p-4 mb-8">
        <TaskForm existingTask={task} />
      </div>
    </>
  );
};

export default EditTaskPageClient;
