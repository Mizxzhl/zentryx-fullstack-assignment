import { useState, useEffect } from "react";
import type { Task } from "../types/task";
import api from "../services/api";
import AddTaskModal from "../components/AddTaskModal";

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Fetch tasks when the page loads
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/tasks/${id}`);

      // Refresh the task list
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  return (
    <div className="p-8">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Task
        </button>
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <AddTaskModal
  onClose={() => {
    setShowModal(false);
    setSelectedTask(null);
  }}
  onTaskCreated={fetchTasks}
  task={selectedTask}
/>
      )}

      {/* Task List */}
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="border rounded-lg p-4 shadow">
              <h2 className="font-bold text-xl">{task.title}</h2>

              <p>{task.description}</p>

              <p>
                <strong>Status:</strong> {task.status}
              </p>

              <p>
                <strong>Priority:</strong> {task.priority}
              </p>

              <p>
                <strong>Due:</strong>{" "}
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
<div className="mt-4 flex justify-end gap-2">

  <button
    onClick={() => handleEdit(task)}
    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
  >
    Edit
  </button>

  <button
    onClick={() => handleDelete(task.id)}
    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
  >
    Delete
  </button>

</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
