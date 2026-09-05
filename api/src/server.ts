import "reflect-metadata";
import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { AppDataSource } from "@/config";
import { customResponse, handleError } from "@/middlewares";
import rootRouter from "@/routes";

const app: Express = express();

const corsOptions = {
  origin: "http://localhost:5001",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(customResponse);
app.use(express.json());

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
  },
  apis: ["./src/**/*.ts"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use(rootRouter);

// Error
app.use(handleError);

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
