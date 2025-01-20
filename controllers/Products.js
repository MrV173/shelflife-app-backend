import Product from "../models/ProductModel.js";
import Category from "../models/CategoryModel.js";
import { Op } from "sequelize";
import Shelflifes from "../models/ShelflifeModel.js";

export const getProducts = async (req, res) => {
  const { excludedCategoryName } = req.query;
  try {
    const response = await Product.findAll({
      include: {
        model: Category,
        attributes: ["name", "uuid"],
        where: {
          name: { [Op.ne]: excludedCategoryName },
        },
        required: true,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const response = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const CreateProduct = async (req, res) => {
  const { name, shelflifeInHour, shelflifeInMinute, categoryId } = req.body;
  try {
    const category = await Category.findOne({ where: { uuid: categoryId } });
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    await Product.create({
      name: name,
      shelflifeInHour: shelflifeInHour,
      shelflifeInMinute: shelflifeInMinute,
      categoryId: category.id,
    });
    res.status(200).json({ msg: "Create Product Successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const UpdateProduct = async (req, res) => {
  const product = await Product.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  const { name, shelflifeInHour, shelflifeInMinute } = req.body;
  try {
    await Product.update(
      {
        name: name,
        shelflifeInHour: shelflifeInHour,
        shelflifeInMinute: shelflifeInMinute,
      },
      {
        where: {
          id: product.id,
        },
      }
    );
    res.status(200).json({ msg: "Update Product Successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const DeleteProduct = async (req, res) => {
  const product = await Product.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  try {
    await Product.destroy({
      where: {
        id: product.id,
      },
    });
    res.status(200).json({ msg: "Product deleted succesfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetProductByCategory = async (req, res) => {
  const { categoryName } = req.query;
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          where: { name: categoryName },
          attributes: ["name", "uuid"],
        },
      ],
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
