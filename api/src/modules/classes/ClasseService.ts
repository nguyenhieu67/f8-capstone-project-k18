import { BaseService } from "@/common";
import { validateEmployeeRole } from "../employees/helpers/validateEmployeeRole";
import { EmployeeRole } from "../employees/EmployeeEntity";
import { ClasseEntity } from "./ClasseEntity";

class ClasseService extends BaseService {
  protected fkValidators = [
    {
      field: "trainerId",
      validate: (id: number) => validateEmployeeRole(id, EmployeeRole.TRAINER, "trainerId"),
    },
  ];
}

export default new ClasseService(ClasseEntity);
