import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import session from "express-session";
import UserRoute from "./routes/UserRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import ShelfeRoute from "./routes/ShelflifeRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import CategoryRoute from "./routes/CategoryRoute.js";
import RareProductRoute from "./routes/RarelyUsedProductRoute.js";
import { defaultData } from "./config/DefaultData.js";
dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});

(async () => {
  await db.sync();
})();

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(UserRoute);
app.use(ProductRoute);
app.use(AuthRoute);
app.use(ShelfeRoute);
app.use(CategoryRoute);
app.use(RareProductRoute);

defaultData();
store.sync();

app.listen(process.env.APP_PORT, () => {
  console.log("Server runing at port 5000");
});
