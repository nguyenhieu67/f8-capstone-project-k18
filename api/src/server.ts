import "reflect-metadata";
import express, { type Express } from "express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { AppDataSource } from "@/config/database";
import rootRouter from "@/routes/index";
import { customResponse } from "@/middlewares/index";

const app: Express = express();

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Edu CRM API",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/**/*.ts"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware
app.use(customResponse);

app.use(rootRouter);

const port = 3000;

async function bootstrap() {
  await AppDataSource.initialize();
  console.log("Database connected");

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
