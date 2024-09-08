import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface Task {
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
}

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

// Fetch tasks from Firestore
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const querySnapshot = await getDocs(collection(db, "tasks"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Task[];
});

// Add a new task to Firestore
export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (newTask: Omit<Task, "id">) => {
    try {
      const docRef = await addDoc(collection(db, "tasks"), newTask);
      return { id: docRef.id, ...newTask };
    } catch (error) {
      console.log("e", error);
      return undefined; // Return undefined if there is an error
    }
  }
);

export const editTask = createAsyncThunk(
  "tasks/editTask",
  async (updatedTask: Task) => {
    const taskDocRef = doc(db, "tasks", updatedTask.id);
    // Converting the task object into a format suitable for Firestore update
    const taskUpdateData = {
      title: updatedTask.title || "",
      description: updatedTask.description,
      dueDate: updatedTask.dueDate,
      priority: updatedTask.priority,
      "location.lat": updatedTask.location.lat, // Using Firestore's dot notation for nested fields
      "location.lng": updatedTask.location.lng,
      completed: updatedTask.completed,
    };
    await updateDoc(taskDocRef, taskUpdateData);
    return updatedTask;
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: string) => {
    const taskDocRef = doc(db, "tasks", taskId);
    await deleteDoc(taskDocRef);
    return taskId; // Return the taskId so we can remove it from the Redux state
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
      state.loading = false;
    },
    updateTaskStatus: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    appendTaskList: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tasks";
      })
      .addCase(addTask.fulfilled, (state, action) => {
        if (action.payload) state.tasks.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add task";
      })
      .addCase(editTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      });
  },
});

export const { setTasks, updateTaskStatus, appendTaskList } =
  tasksSlice.actions;
export default tasksSlice.reducer;
