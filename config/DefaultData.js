import argon2 from "argon2";
import User from "../models/UserModel.js";
import Category from "../models/CategoryModel.js";

export const defaultData = async () => {
  const password = process.env.ADMINPASS;
  const email = process.env.ADMINEMAIL;
  const name = process.env.ADMINNAME;
  const role = process.env.ADMINROLE;
  const hashedPassword = await argon2.hash(password);
  const categories = [
    { name: "Hot Display" },
    { name: "Thawing" },
    { name: "Bain Marie" },
    { name: "Suhu Ruang" },
    { name: "Bar" },
    { name: "Open Pack" },
    { name: "Rarely Used Product" },
  ];

  try {
    const isAdmin = await User.findOne({
      where: { email: "admin@gmail.com" },
    });
    if (!isAdmin) {
      await User.create({
        name: name,
        email: email,
        password: hashedPassword,
        role: role,
      });
      console.log("Admin user created Succesfully");
    } else {
      console.log("admin user already existed");
    }
    for (const category of categories) {
      const isCategory = await Category.findOne({
        where: { name: category.name },
      });
      if (!isCategory) {
        await Category.bulkCreate(categories);
        console.log(`Category created succesfully`);
      } else {
        console.log(`Category already existed`);
      }
    }
  } catch (error) {
    console.error("Error create defaul data", error.message);
  }
};
