import { BaseService } from "@/common";
import { UserEntity } from "./UserEntity";

class UserService extends BaseService {}

export default new UserService(UserEntity);
