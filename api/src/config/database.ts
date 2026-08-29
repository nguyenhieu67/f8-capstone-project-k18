import { DataSource } from "typeorm";

import env from "./environment";
import {
  UserEntity,
  ClasseEntity,
  EmployeeEntity,
  LeadEntity,
  SourceEntity,
  StudentEntity,
  RefreshTokenEntity,
  PasswordResetEntity,
  StudentClasseEntity,
  StudentAttendanceEntity,
} from "@/modules";
import { SnakeNamingStrategy } from "./SnakeNamingStrategy";

const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST || "db",
  port: Number(env.DB_PORT) || 5432,
  username: env.DB_USER_NAME || "postgres",
  password: env.DB_PASSWORD || "postgres",
  database: env.DB_DATABASE || "default",
  synchronize: false,
  logging: true,
  entities: [
    RefreshTokenEntity,
    PasswordResetEntity,
    UserEntity,
    SourceEntity,
    EmployeeEntity,
    ClasseEntity,
    LeadEntity,
    StudentEntity,
    StudentClasseEntity,
    StudentAttendanceEntity,
  ],
  subscribers: [],
  migrations: [],
  namingStrategy: new SnakeNamingStrategy(),
});

export default AppDataSource;
