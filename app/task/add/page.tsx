"use client";

import React from "react";
import TaskForm from "../../../components/TaskForm";
import Header from "@/components/Header";

const AddTaskPage: React.FC = () => {
  return (
    <>
      <Header title="Add Task" />
      <div className="sm:p-8 p-4 mb-8">
        <TaskForm />
      </div>
    </>
  );
};

export default AddTaskPage;
