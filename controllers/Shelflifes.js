import Shelflifes from "../models/ShelflifeModel.js";
import Category from "../models/CategoryModel.js";
import moment from "moment-timezone";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getShelflifes = async (req, res) => {
  try {
    const today = moment().format("YYYY-MM-DD");

    let response;
    if (req.role === "admin") {
      response = await Shelflifes.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: ["name"],
          },
        ],
        order: [[{ model: User, as: "user" }, "name", "ASC"]],
      });
    } else {
      response = await Shelflifes.sequelize.query(
        `
       SELECT S.*
        FROM Shelflifes S
        INNER JOIN (
          SELECT name, MAX(startShelflife) AS maxStartShelflife
          FROM Shelflifes
          WHERE userId = :userId AND startDate = :todayDate
          GROUP BY name
        ) AS groupedShelflifes
        ON S.name = groupedShelflifes.name AND S.startShelflife = groupedShelflifes.maxStartShelflife
        WHERE S.userId = :userId 
        ORDER BY S.startShelflife DESC
        `,
        {
          replacements: { userId: req.userId, todayDate: today },
          model: Shelflifes,
          mapToModel: true,
        }
      );
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const CreateShelflife = async (req, res) => {
  const { name, hour, minute, categoryId } = req.body;

  if (typeof hour !== "number" || typeof minute !== "number") {
    return res.status(400).json({ msg: error.message });
  }

  const now = new moment.tz("Asia/Jakarta");
  const start = new moment.tz("Asia/Jakarta");
  const day = Math.floor(hour / 24);
  const endDate = now.clone().add(day, "days").format("YYYY-MM-DD");
  const end = start.clone().add(hour, "hours").add(minute, "minutes");

  try {
    const category = await Category.findOne({ where: { uuid: categoryId } });
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    await Shelflifes.create({
      name: name,
      startDate: now.format("YYYY-MM-DD"),
      endDate: endDate,
      startShelflife: start.format("HH:mm:ss"),
      endShelflife: end.format("HH:mm:ss"),
      userId: req.userId,
      categoryId: category.id,
    });
    res.status(200).json({
      message: "Shelflife created successfully",
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const AllShelflife = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Shelflifes.findAll({
        include: [{ model: User }],
      });
    } else {
      response = await Shelflifes.findAll({
        where: {
          userId: req.userId,
        },
        include: [{ model: User }],
        order: [
          ["name", "ASC"],
          ["createdAt", "DESC"],
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetShelflifesByDate = async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res
      .status(400)
      .json({ msg: "Tanggal harus disertakan dalam permintaan." });
  }

  try {
    const data = await Shelflifes.findAll({
      where: {
        startDate: {
          [Op.eq]: date,
        },
        userId: req.userId,
      },
      include: [{ model: User }],
      order: [
        ["name", "ASC"],
        ["createdAt", "DESC"],
      ],
    });

    if (data.length === 0) {
      return res.status(404).json({ msg: "No Shelflife in this date" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// export const GetShelflifeByCategory = async (req, res) => {
//   const { categoryName } = req.query;

//   try {
//     const response = await Shelflifes.sequelize.query(
//       `
//       SELECT S.*
//       FROM Shelflifes S
//       INNER JOIN Categories C ON S.categoryId = C.id -- Relasi dengan model Categories menggunakan UUID
//       WHERE C.name = :categoryName -- Filter berdasarkan kategori
//       AND S.userId = :userId -- Filter berdasarkan userId
//       AND S.endShelflife >= (
//         SELECT MAX(endShelflife)
//         FROM Shelflifes
//         WHERE name = S.name
//         AND userId = :userId
//       )
//       ORDER BY S.endShelflife DESC -- Urutkan berdasarkan endShelflife paling baru
//       `,
//       {
//         replacements: {
//           userId: req.userId,
//           categoryName: categoryName,
//         },
//         model: Shelflifes,
//         mapToModel: true,
//       }
//     );

//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

export const GetShelflifeByCategory = async (req, res) => {
  const { categoryName } = req.query;

  try {
    const response = await Shelflifes.sequelize.query(
      `
      SELECT S.*
      FROM Shelflifes S
      INNER JOIN Categories C ON S.categoryId = C.id
      WHERE C.name = :categoryName 
      AND S.userId = :userId 
      ORDER BY S.name, S.createdAt DESC
      `,
      {
        replacements: {
          userId: req.userId,
          categoryName: categoryName,
        },
        model: Shelflifes,
        mapToModel: true,
      }
    );

    const groupedByName = response.reduce((acc, shelflife) => {
      if (!acc.has(shelflife.name)) {
        acc.set(shelflife.name, []);
      }
      const group = acc.get(shelflife.name);
      if (group.length < 2) {
        group.push(shelflife);
      }
      return acc;
    }, new Map());
    const result = Array.from(groupedByName.values()).flat();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const CreateRareProductShelflife = async (req, res) => {
  const { name, month, day, categoryId } = req.body;

  if (typeof month !== "number" || typeof day !== "number") {
    return res.status(400).json({ msg: error.message });
  }

  const now = new moment.tz("Asia/Jakarta");
  const endDate = now.clone().add(month, "months").add(day, "days");

  try {
    const category = await Category.findOne({ where: { uuid: categoryId } });
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }
    await Shelflifes.create({
      name: name,
      startDate: now.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      startShelflife: now.format("HH:mm:ss"),
      endShelflife: now.format("HH:mm:ss"),
      userId: req.userId,
      categoryId: category.id,
    });
    res.status(200).json({
      message: "Shelflife created successfully",
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const GetRareProductShelflifes = async (req, res) => {
  const { categoryName } = req.params;

  try {
    const category = await Category.findOne({
      where: {
        name: categoryName,
      },
    });
    if (!category) {
      return res.status(404).json({ msg: "Category Not found" });
    }

    const shelflifes = await Shelflifes.findAll({
      where: {
        categoryId: category.id,
        userId: req.userId,
      },
      order: [
        ["name", "ASC"],
        ["createdAt", "DESC"],
      ],
    });

    const latestShelflifes = [];
    const seenNames = new Set();
    // const seenNames = new Map();

    shelflifes.forEach((shelflife) => {
      if (!seenNames.has(shelflife.name)) {
        latestShelflifes.push(shelflife);
        seenNames.add(shelflife.name);
      }
    });

    // shelflifes.forEach((shelflife) => {
    //   if (!seenNames.has(shelflife.name)) {
    //     seenNames.set(shelflife.name, 1);
    //     latestShelflifes.push(shelflife);
    //   } else if (seenNames.get(shelflife.name) === 1) {
    //     seenNames.set(shelflife.name, 2);
    //     latestShelflifes.push(shelflife);
    //   }
    // });

    res.status(200).json(latestShelflifes);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
