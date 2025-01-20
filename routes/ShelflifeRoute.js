import express from "express";
import {
  AllShelflife,
  CreateRareProductShelflife,
  CreateShelflife,
  GetRareProductShelflifes,
  GetShelflifeByCategory,
  getShelflifes,
  GetShelflifesByDate,
  updateShelflifeById,
} from "../controllers/Shelflifes.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/shelflifes", verifyUser, getShelflifes);
router.post("/shelflife", verifyUser, CreateShelflife);
router.post("/shelflife/rare-product", verifyUser, CreateRareProductShelflife);
router.get("/shelflifes/category-name", verifyUser, GetShelflifeByCategory);
router.get("/user-shelflifes", verifyUser, AllShelflife);
router.get("/user-shelflifes/history", verifyUser, GetShelflifesByDate);
router.get(
  "/shelflifes/rare-product/:categoryName",
  verifyUser,
  GetRareProductShelflifes
);
router.patch("/shelflifes/:id", verifyUser, updateShelflifeById);

export default router;
