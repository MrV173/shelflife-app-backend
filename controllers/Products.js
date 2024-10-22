import Product from "../models/ProductModel.js";

export const getProducts = async (req, res) => {
  try {
    const response = await Product.findAll();
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
  const { name, shelflifeInHour, shelflifeInMinute } = req.body;
  try {
    await Product.create({
      name: name,
      shelflifeInHour: shelflifeInHour,
      shelflifeInMinute: shelflifeInMinute,
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
