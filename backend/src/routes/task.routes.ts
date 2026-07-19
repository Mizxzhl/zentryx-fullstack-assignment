import { Router } from "express";
import { create,getAll ,update , remove } from "../controllers/task.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Create Task
router.post("/", authenticate, create);

export default router;

// POST /api/tasks
//         ↓
// authenticate (Checks JWT)
//         ↓
// create() (Creates task)

// If the token is invalid  → Request stops.
// If the token is valid  → Task is created.


// Get all tasks
router.get("/", authenticate, getAll);

// Update Task
router.put("/:id", authenticate, update);

// Delete Task
router.delete("/:id", authenticate, remove);