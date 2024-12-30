import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  getCategoryByName,
} from "../controllers/Category.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/categories", verifyUser, getCategories);
router.get("/category/:id", verifyUser, getCategoryById);
router.get("/category/name/:name", verifyUser, getCategoryByName);
router.post("/category", verifyUser, createCategory);
router.delete("/category/:id", verifyUser, deleteCategory);

export default router;
