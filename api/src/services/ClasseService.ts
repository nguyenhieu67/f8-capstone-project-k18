import { ClasseEntity, EmployeeRole } from "@/entities";
import { BaseService } from "./BaseService";
import { validateEmployeeRole } from "./helpers/validateEmployeeRole";

class ClasseService extends BaseService {
  protected fkValidators = [
    {
      field: "trainerId",
      validate: (id: number) => validateEmployeeRole(id, EmployeeRole.TRAINER, "trainerId"),
    },
  ];
}

export default new ClasseService(ClasseEntity);
