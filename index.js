import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import userController from "./src/controllers/user.controller.js";

import {
  authMiddleware,
  isAdmin,
  globalErrorMiddleware,
} from "./src/middlewares/multi.middleware.js";

dotenv.config();

const app = express();

// DB
connectDB();

// body parser
app.use(express.json());

// routes
app.post("/api/users", userController.createUser);
app.post("/api/login", authMiddleware, isAdmin, userController.logIn);
app.get("/api/me/:userId", authMiddleware, isAdmin, userController.getUser);
app.get("/api/all-users", authMiddleware, isAdmin, userController.getAllUser);
app.put("/api/update/:userId", userController.updUser);
app.delete(
  "/api/delete/:userId",
  authMiddleware,
  isAdmin,
  userController.deleteUser
);

app.use(globalErrorMiddleware);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
