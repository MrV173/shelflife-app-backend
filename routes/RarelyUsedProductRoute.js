import express from "express";
import {
  GetRareProducts,
  GetRareProductById,
  CreateRareProduct,
  UpdateRareProduct,
  deleteRareProduct,
} from "../controllers/RarelyUsedProduct.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/rare-products", verifyUser, GetRareProducts);
router.get("/rare-product/:id", verifyUser, GetRareProductById);
router.post("/rare-product", verifyUser, CreateRareProduct);
router.patch("/rare-product/:id", verifyUser, UpdateRareProduct);
router.delete("/rare-product/:id", verifyUser, deleteRareProduct);

export default router;
