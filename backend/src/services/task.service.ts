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
  const totalTasks = await prisma.task.count({
    where: {
      userId,
    },
  });

  const completedTasks = await prisma.task.count({
    where: {
      userId,
      status: "Completed",
    },
  });

  const pendingTasks = await prisma.task.count({
    where: {
      userId,
      status: "pending",
    },
  });

  const highPriorityTasks = await prisma.task.count({
    where: {
      userId,
      priority: "high",
    },
  });

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    highPriorityTasks,
  };
};

// Counts records instead of returning all tasks[prisma.task.count(...)]