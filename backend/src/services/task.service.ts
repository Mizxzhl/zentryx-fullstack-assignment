import { exportString } from "node:ffi";
import prisma from "../lib/prisma";

// Create Task Service
export const createTask = async (
  title: string,
  description: string,
  priority: string,
  dueDate: Date,
  userId: string,
) => {
  return await prisma.task.create({
    data: {
      title,
      description,
      priority,
      dueDate,
      userId,
    },
  });
};

// Get all tasks for logged-in user
export const getTasks = async (userId: string) => {
  return await prisma.task.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

//Update task
export const updateTask = async (
  taskId: string,
  userId: string,
  title: string,
  description: string,
  priority: string,
  status: string,
  dueDate: Date,
) => {
  // Check task belongs to logged-in user
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }
  // Update task
  return await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      title,
      description,
      priority,
      status,
      dueDate,
    },
  });
};

// Delete Task
export const deleteTask = async (
  taskId: string,
  userId: string
) => {

  // Check task belongs to logged-in user
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  // Delete task
  return await prisma.task.delete({
    where: {
      id: taskId,
    },
  });
};

//Task Analytics
export const getTaskAnalytics = async (userId: string) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const activeTasks = await prisma.task.count({
    where: { userId, status: { not: "Completed" } },
  });

  const completedToday = await prisma.task.count({
    where: {
      userId,
      status: "Completed",
      updatedAt: { gte: startOfToday, lt: startOfTomorrow },
    },
  });

  const overdueTasks = await prisma.task.count({
    where: {
      userId,
      status: { not: "Completed" },
      dueDate: { lt: startOfToday },
    },
  });

  const [completed, inProgress, todo, high, medium, low] = await Promise.all([
    prisma.task.count({ where: { userId, status: "Completed" } }),
    prisma.task.count({ where: { userId, status: "In Progress" } }),
    prisma.task.count({ where: { userId, status: "Todo" } }),
    prisma.task.count({ where: { userId, priority: "High" } }),
    prisma.task.count({ where: { userId, priority: "Medium" } }),
    prisma.task.count({ where: { userId, priority: "Low" } }),
  ]);

  return {
    activeTasks,
    completedToday,
    overdueTasks,
    statusDistribution: { completed, inProgress, todo },
    priorityBreakdown: { high, medium, low },
  };
};

// Counts records instead of returning all tasks[prisma.task.count(...)]
