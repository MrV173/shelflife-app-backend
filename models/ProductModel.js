import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import CategoryModel from "./CategoryModel.js";

const { DataTypes } = Sequelize;

const Products = db.define(
  "products",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    shelflifeInHour: {
      type: DataTypes.INTEGER,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    shelflifeInMinute: {
      type: DataTypes.INTEGER,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },

  {
    freezeTableName: true,
  }
);

CategoryModel.hasMany(Products);
Products.belongsTo(CategoryModel, { foreignKey: "categoryId" });

export default Products;
