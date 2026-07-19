import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request to include userId
export interface AuthRequest extends Request {
  userId?: string;
}

// JWT Authentication Middleware
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  // Get Authorization header
  const authHeader = req.headers.authorization;

  // Check if token exists
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({
      message: "Acces denied.Notoken provided",
    });
  }
  // Extract token
  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: string };

    // Save userId for next controller
    req.userId = decoded.userId;

    // Continue to next function
    next();
  } catch {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
