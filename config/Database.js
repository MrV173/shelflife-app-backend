import { Sequelize } from "sequelize";

const db = new Sequelize("tester", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;