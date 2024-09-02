export const getPriorityColor = (priority: string) => {
  if (priority === "Low") return "text-sky-400";
  if (priority === "Medium") return "text-yellow-400";
  if (priority === "High") return "text-red-400";
};
