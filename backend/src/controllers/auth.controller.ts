import { Request, Response } from "express";
import { registerUser } from "../services/auth.service";
import {  loginUser } from "../services/auth.service";


export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
  return res.status(400).json({
    message: "All fields are required",
  });
}

// Validate email format
const emailRegex =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({
    message: "Invalid email format!",
  });
}

    const user = await registerUser(name, email, password);

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Registration failed",
    });
  }
};

// Login Controller
export const login = async (req: Request, res: Response) => {
  try {
    // Get email and password from request
    const { email, password } = req.body;

    // Check if fields are empty
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    // Login user
    const result = await loginUser(email, password);

    // Send success response
    res.status(200).json({
      message: "Login successful",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    // Handle errors
    res.status(400).json({
      message: error instanceof Error ? error.message : "Login failed",
    });
  }
};