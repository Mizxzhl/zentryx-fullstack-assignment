import { useEffect, useState } from "react";
import api from "../services/api";
import type { Task } from "../types/task";

type AddTaskModalProps = {
  onClose: () => void;
  onTaskCreated: () => void;
  task: Task | null;
};

const AddTaskModal = ({
  onClose,
  onTaskCreated,
  task,
}: AddTaskModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Todo");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (!task) return;

    setTitle(task.title);
    setDescription(task.description ?? "");
    setPriority(task.priority.toString());
    setStatus(task.status.toString());
    setDueDate(new Date(task.dueDate).toISOString().split("T")[0]);
  }, [task]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const taskData = {
      title,
      description,
      priority,
      dueDate,
    };

    if (task) {
      await api.put(`/tasks/${task.id}`, { ...taskData, status });
    } else {
      await api.post("/tasks", taskData);
    }

    onTaskCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-5 shadow-lg sm:p-6">

        <h2 className="text-2xl font-bold mb-6">
          {task ? "Edit Task" : "Add New Task"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          {task && (
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          )}

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg bg-gray-300 px-4 py-2 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 sm:w-auto"
            >
              {task ? "Save Changes" : "Create Task"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default AddTaskModal;
