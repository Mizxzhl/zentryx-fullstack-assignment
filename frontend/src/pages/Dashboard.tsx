import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Task } from "../types/task";
import api from "../services/api";
import AddTaskModal from "../components/AddTaskModal";
import type { Analytics } from "../types/analytics";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../components/Toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskIdToDelete, setTaskIdToDelete] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<Analytics>({
    activeTasks: 0,
    completedToday: 0,
    overdueTasks: 0,
    statusDistribution: { completed: 0, inProgress: 0, todo: 0 },
    priorityBreakdown: { high: 0, medium: 0, low: 0 },
  });

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await api.get("/tasks/analytics");
      setAnalytics(response.data);
    } catch (error) {
      console.error("Failed to fetch analytics", error);
    }
  };

  const refreshTasksAndAnalytics = async () => {
    await Promise.all([fetchTasks(), fetchAnalytics()]);
  };

  // Fetch tasks and analytics when the page loads.
  useEffect(() => {
    void refreshTasksAndAnalytics();
  }, []);

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    setTaskIdToDelete(id);
  };

  const confirmDelete = async () => {
    if (!taskIdToDelete) return;

    try {
      await api.delete(`/tasks/${taskIdToDelete}`);

      await refreshTasksAndAnalytics();
      showToast("Task deleted successfully!");
    } catch (error) {
      console.error("Failed to delete task", error);
      showToast("Failed to delete task.", "error");
    } finally {
      setTaskIdToDelete(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const statusChartData = [
    { name: "Completed", value: analytics.statusDistribution.completed },
    { name: "In Progress", value: analytics.statusDistribution.inProgress },
    { name: "To Do", value: analytics.statusDistribution.todo },
  ];

  const priorityChartData = [
    { name: "High", tasks: analytics.priorityBreakdown.high },
    { name: "Medium", tasks: analytics.priorityBreakdown.medium },
    { name: "Low", tasks: analytics.priorityBreakdown.low },
  ];

  const statusColors = ["#22c55e", "#3b82f6", "#f59e0b"];

  return (
    <div className="p-8">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700"
          >
            Home
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            + Add Task
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
        <div className="p-4 text-white bg-blue-500 rounded-lg shadow">
          <h3 className="text-lg">Active Tasks</h3>
          <p className="text-3xl font-bold">{analytics.activeTasks}</p>
        </div>

        <div className="p-4 text-white bg-green-500 rounded-lg shadow">
          <h3 className="text-lg">Completed Today</h3>
          <p className="text-3xl font-bold">{analytics.completedToday}</p>
        </div>

        <div className="p-4 text-white bg-red-500 rounded-lg shadow">
          <h3 className="text-lg">Overdue Tasks</h3>
          <p className="text-3xl font-bold">{analytics.overdueTasks}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">Task Status Distribution</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  label
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={entry.name} fill={statusColors[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">Priority Breakdown</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityChartData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="tasks" name="Tasks" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <AddTaskModal
  onClose={() => {
    setShowModal(false);
    setSelectedTask(null);
  }}
  onTaskCreated={refreshTasksAndAnalytics}
  task={selectedTask}
/>
      )}

      {taskIdToDelete && (
        <ConfirmModal
          message="Are you sure you want to delete this task?"
          onCancel={() => setTaskIdToDelete(null)}
          onConfirm={confirmDelete}
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
