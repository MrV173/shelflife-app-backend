import express from "express";
import {
  getUsers,
  getUserById,
  CreateUser,
  UpdateUser,
  DeleteUser,
} from "../controllers/Users.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/users", verifyUser, adminOnly, getUsers);
router.get("/user/:id", verifyUser, adminOnly, getUserById);
router.post("/user", verifyUser, adminOnly, CreateUser);
router.patch("/user/:id", verifyUser, adminOnly, UpdateUser);
router.delete("/user/:id", verifyUser, adminOnly, DeleteUser);

export default router;
