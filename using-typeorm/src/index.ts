import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { AppDataSource } from "./data-source";
import { routes } from "./routes";

dotenv.config();

AppDataSource.initialize()
  .then(() => {
    const app = express();

    app.use(cookieParser());
    app.use(express.json());
    app.use(
      cors({
        origin: ["http://localhost:1235"],
      })
    );

    routes(app);

    app.listen(1234, () => {
      console.log("listening to port 1234");
    });
  })
  .catch((error) => console.error(error));
