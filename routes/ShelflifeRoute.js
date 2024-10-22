import express from "express";
import {
  AllShelflife,
  CreateShelflife,
  getShelflifes,
} from "../controllers/Shelflifes.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/shelflifes", verifyUser, getShelflifes);
router.post("/shelflife", verifyUser, CreateShelflife);
router.get("/user-shelflifes", verifyUser, AllShelflife);

export default router;
