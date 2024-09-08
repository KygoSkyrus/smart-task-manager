import EditTaskPage from "@/components/EditTaskPage";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Generate static params for editing task pages
export async function generateStaticParams() {
  const tasksCollection = collection(db, "tasks");
  const taskDocs = await getDocs(tasksCollection);

  return taskDocs.docs.map((doc) => ({
    id: doc.id,
  }));
}

// Server-side page component
const EditTask = ({ params }: { params: { id: string } }) => {
  return <EditTaskPage id={params.id} />; 
};

export default EditTask;