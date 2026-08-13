import { DataSource } from "typeorm";

import env from "./environment";
import { SourceEntity } from "@/entities";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST || "db",
  port: Number(env.DB_PORT) || 5432,
  username: env.DB_USER_NAME || "postgres",
  password: env.DB_PASSWORD || "postgres",
  database: env.DB_DATABASE || "default",
  synchronize: false,
  logging: true,
  entities: [SourceEntity],
  subscribers: [],
  migrations: [],
});
