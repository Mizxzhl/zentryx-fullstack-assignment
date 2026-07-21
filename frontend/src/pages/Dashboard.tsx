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
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const userName = localStorage.getItem("userName") ?? "there";

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

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => window.clearInterval(timer);
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
    localStorage.removeItem("userName");
    navigate("/");
  };

  const sortedTasks = [...tasks].sort((firstTask, secondTask) => {
    const priorityOrder: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
    const priorityDifference =
      (priorityOrder[firstTask.priority.toString()] ?? 3) -
      (priorityOrder[secondTask.priority.toString()] ?? 3);

    if (priorityDifference !== 0) return priorityDifference;

    return new Date(firstTask.dueDate).getTime() - new Date(secondTask.dueDate).getTime();
  });

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
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      {/* Dashboard Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Task Management</p>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {userName}!</h1>
          <p className="mt-1 text-sm text-slate-500">
            {currentDateTime.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {" · "}
            {currentDateTime.toLocaleTimeString()}
          </p>
        </div>

        <div className="flex gap-2">
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
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          No tasks found. Add your first task to get started.
        </div>
      ) : (
        <div>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Your Tasks</h2>
              <p className="text-sm text-slate-500">High-priority tasks and nearer due dates appear first.</p>
            </div>
            <span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700">
              {tasks.length} tasks
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sortedTasks.map((task) => (
              <article
                key={task.id}
                className="flex min-h-56 flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-slate-900">{task.title}</h3>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      task.priority === "High"
                        ? "bg-red-100 text-red-700"
                        : task.priority === "Medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>

                <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                  {task.description || "No description provided."}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                  <span className="rounded-md bg-blue-50 px-2 py-1 font-medium text-blue-700">
                    {task.status}
                  </span>
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-700">
                    Due {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-auto flex justify-end gap-2 pt-5">
                  <button
                    onClick={() => handleEdit(task)}
                    className="rounded-lg bg-amber-500 px-3 py-2 text-sm text-white hover:bg-amber-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
