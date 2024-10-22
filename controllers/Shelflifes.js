import Shelflifes from "../models/ShelflifeModel.js";
import moment from "moment-timezone";
import User from "../models/UserModel.js";
import { Sequelize } from "sequelize";

export const getShelflifes = async (req, res) => {
  try {
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
          WHERE userId = :userId
          GROUP BY name
        ) AS groupedShelflifes
        ON S.name = groupedShelflifes.name AND S.startShelflife = groupedShelflifes.maxStartShelflife
        WHERE S.userId = :userId
        ORDER BY S.startShelflife DESC
        `,
        {
          replacements: { userId: req.userId }, // Ganti dengan ID user yang sedang login
          model: Shelflifes, // Model untuk mapping hasil ke instance Sequelize
          mapToModel: true, // Hasil query diubah menjadi instance model Sequelize
        }
      );
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const CreateShelflife = async (req, res) => {
  const { name, hour, minute } = req.body;

  if (typeof hour !== "number" || typeof minute !== "number") {
    return res.status(400).json({ msg: error.message });
  }

  const date = new moment.tz("Asia/Jakarta");
  const start = new moment.tz("Asia/Jakarta");
  const end = start.clone().add(hour, "hours").add(minute, "minutes");

  try {
    await Shelflifes.create({
      name: name,
      date: date.format("YYYY-MM-DD"),
      startShelflife: start.format("HH:mm:ss"),
      endShelflife: end.format("HH:mm:ss"),
      userId: req.userId,
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
