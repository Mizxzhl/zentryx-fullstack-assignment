import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { createTask ,getTasks, updateTask, deleteTask , getTaskAnalytics} from "../services/task.service";

// Create Task Controller
export const create = async (req: AuthRequest, res: Response) => {
  try {
    // Get task details from request
    const { title, description, priority, dueDate } = req.body;

    // Create task
    const task = await createTask(
      title,
      description,
      priority,
      new Date(dueDate),
      req.userId!, // This comes from the JWT middleware.When the token is valid, the middleware stores the logged-in user's ID in req.userId.
      // That means every task is automatically linked to the correct user.
    );

    // Send response
    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Failed",
    });
  }
};


// Get My Tasks
export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    // Get tasks of logged-in user
    const tasks = await getTasks(req.userId!);

    // Send response
    res.status(200).json(tasks);
  } catch {
    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
};

// Update Task
export const update = async (req : AuthRequest , res: Response) =>{
    try{
        // Get task id from URL
        const id = String(req.params.id);
    

    const {
        title,
        description,
        priority,
        status,
        dueDate,
    } = req.body;

    const task = await updateTask(

        id,
        req.userId!,
        title,
        description,
        priority,
        status,
        new Date(dueDate)

    );

    res.status(200).json({
        message :"Task Update successfully",
        task,
    });
} catch (error) {
    res.status(400).json ({
        message : error instanceof Error ? error.message :"Update failed",

    });

}
};

// Delete Task Controller
export const remove = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    // Get task id from URL
    const id = String(req.params.id);

    // Delete task
    await deleteTask(id, req.userId!);

    // Success response
    res.status(200).json({
      message: "Task deleted successfully",
    });

  } catch (error) {

    res.status(400).json({
      message: error instanceof Error ? error.message : "Delete failed",
    });

  }
};

// Task Analytics
export const analytics = async (req: AuthRequest, res: Response) => {
  try {
    // Get analytics for logged-in user
    const Data = await getTaskAnalytics(req.userId!);

    res.status(200).json(Data);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch analytics",
    });
  }
};
