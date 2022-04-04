import { Request, Response, Router } from "express";
import {
  AuthenticatedUser,
  Login,
  Register,
  Logout,
  UpdateInfo,
  UpdatePassword,
} from "./controller/auth.controller";
import { AuthMiddleware } from "./middleware/auth.middleware";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "My REST API - Documentation",
      description: "Description of my API here",
      contact: {
        name: "Naveen Kumar",
        email: "nnav33nk@gmail.com",
        url: "https://naveenkumar.dev",
      },
    },
    servers: [
      {
        url: "http://localhost:1234/",
        description: "Local Server",
      },
      {
        url: "https://naveenkumar.dev",
        description: "Production Server",
      },
    ],
    tags: [
      {
        name: "Auth",
      },
      {
        name: "Users",
      },
    ],
  },
  apis: ["./routes.ts"],
};

export const routes = (router: Router) => {
  router.get("/", (req: Request, res: Response) => {
    res.send("Express says hello!");
  });

  router.use("/docs", swaggerUi.serve);
  router.get("/docs", swaggerUi.setup(swaggerJSDoc(swaggerOptions)));

  /**
   * @swagger
   *
   * /api/v1/register:
   *  post:
   *     description: Register new user
   *     tags:[Auth]
   *     responses:
   *       200:
   *         description: Success
   */
  router.post("/api/v1/register", Register);
  router.post("/api/v1/login", Login);
  router.post("/api/v1/logout", AuthMiddleware, Logout);
  router.put("/api/v1/update-password", AuthMiddleware, UpdatePassword);

  router.get("/api/v1/user", AuthMiddleware, AuthenticatedUser);
  router.put("/api/v1/user", AuthMiddleware, UpdateInfo);
};
