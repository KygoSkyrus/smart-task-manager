import { getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import TaskDetailPage from "./../../../components/TaskDetailPage";  // Importing client-side component

// Generate static params at build time for tasks
export async function generateStaticParams() {
  const tasksCollection = collection(db, "tasks");
  const taskDocs = await getDocs(tasksCollection);

  return taskDocs.docs.map((doc) => ({
    id: doc.id,
  }));
}

// Server-side page component
const TaskPage = ({ params }: { params: { id: string } }) => {
  return <TaskDetailPage id={params.id} />;  // Passing the task ID to the client-side component
};

export default TaskPage;
