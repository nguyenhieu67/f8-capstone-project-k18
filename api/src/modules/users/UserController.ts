import { BaseController } from "@/common";
import UserService from "./UserService";

class UserController extends BaseController {}

export default new UserController(UserService);
