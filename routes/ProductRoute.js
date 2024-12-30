import express from "express";
import {
  getProducts,
  getProductById,
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
  GetProductByCategory,
} from "../controllers/Products.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/products", verifyUser, getProducts);
router.get("/product/:id", verifyUser, getProductById);
router.get("/products/category-name", verifyUser, GetProductByCategory);
router.post("/product", verifyUser, CreateProduct);
router.patch("/product/:id", verifyUser, UpdateProduct);
router.delete("/product/:id", verifyUser, DeleteProduct);

export default router;
