import RarelyUsedProduct from "../models/RarelyUsedProductModel.js";

export const GetRareProducts = async (req, res) => {
  try {
    const response = await RarelyUsedProduct.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetRareProductById = async (req, res) => {
  try {
    const response = await RarelyUsedProduct.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const CreateRareProduct = async (req, res) => {
  const { name, shelflifeInDay, shelflifeInMonth } = req.body;
  try {
    await RarelyUsedProduct.create({
      name: name,
      shelflifeInMonth: shelflifeInMonth,
      shelflifeInDay: shelflifeInDay,
    });
    res.status(200).json({ msg: "Rare Product Created" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const UpdateRareProduct = async (req, res) => {
  const RareProduct = await RarelyUsedProduct.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  const { name, shelflifeInDay } = req.body;
  try {
    await RarelyUsedProduct.update(
      {
        name: name,
        shelflifeInDay,
      },
      {
        where: {
          id: RareProduct.id,
        },
      }
    );
    res.status(200).json({ msg: "Product Updated" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteRareProduct = async (req, res) => {
  const RareProduct = await RarelyUsedProduct.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  try {
    await RarelyUsedProduct.destroy({
      where: {
        id: RareProduct.id,
      },
    });
    res.status(200).json({ msg: "Rare Product Deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
