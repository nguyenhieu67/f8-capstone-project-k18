import { userService } from "@/services";
import { BaseController } from "./BaseController";

class UserController extends BaseController {}

export default new UserController(userService);
