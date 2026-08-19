import { UserEntity } from "@/entities";
import { BaseService } from "./BaseService";

class UserService extends BaseService {}

export default new UserService(UserEntity);
