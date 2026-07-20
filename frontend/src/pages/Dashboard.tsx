import { useState, useEffect } from "react";
import type { Task } from "../types/task";
import api from "../services/api";

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
