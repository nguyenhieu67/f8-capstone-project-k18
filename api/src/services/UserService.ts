import { BaseService } from "./BaseService";
import { UserEntity } from "@/entities";

class UserService extends BaseService {}

export default new UserService(UserEntity);
