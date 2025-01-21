import { Sequelize } from "sequelize";

const db = new Sequelize(
  "shelfli1_db_hangry",
  "shelfli1_admin",
  ",55ID^5bjmr~",
  {
    host: "localhost",
    dialect: "mysql",
  }
);

export default db;
