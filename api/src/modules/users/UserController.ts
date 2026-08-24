import { BaseController } from "@/common";
import UserService from "./UserService";
import { toUserDetailDto } from "./UserDto";

class UserController extends BaseController {}

export default new UserController(UserService, toUserDetailDto);
