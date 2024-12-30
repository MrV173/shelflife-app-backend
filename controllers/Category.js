import { Op } from "sequelize";
import Category from "../models/CategoryModel.js";

export const getCategories = async (req, res) => {
  try {
    const response = await Category.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const response = await Category.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    await Category.create({
      name: name,
    });
    res.status(200).json({ msg: "Category Created Succesfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  const category = await Category.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!category) return res.status(404).json({ msg: "Category not found" });
  try {
    await Category.destroy({
      where: {
        id: category.id,
      },
    });
    res.status(200).json({ msg: "Category Deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getCategoryByName = async (req, res) => {
  try {
    const response = await Category.findOne({
      where: {
        name: req.params.name, // Ubah ke parameter 'name'
      },
    });

    if (!response) {
      return res.status(404).json({ msg: "Category not found" });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
