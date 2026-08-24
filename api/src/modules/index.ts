// Entities
export * from "./auth/entities";
export * from "./classes/ClasseEntity";
export * from "./employees/EmployeeEntity";
export * from "./leads/LeadEntity";
export * from "./sources/SourceEntity";
export * from "./students/StudentEntity";
export * from "./users/UserEntity";

// Routes
export { default as authRoute } from "./auth/authRoute";
export { default as classeRoute } from "./classes/classeRoute";
export { default as employeeRoute } from "./employees/employeeRoute";
export { default as leadRoute } from "./leads/leadRoute";
export { default as sourceRoute } from "./sources/sourceRoute";
export { default as studentRoute } from "./students/studentRoute";
export { default as userRoute } from "./users/userRoute";
