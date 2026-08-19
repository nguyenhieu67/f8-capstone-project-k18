import { ClasseEntity, EmployeeRole } from "@/entities";
import { BaseService } from "./BaseService";
import { validateEmployeeRole } from "./helpers/validateEmployeeRole";

class ClasseService extends BaseService {
  protected fkValidators = [
    {
      field: "trainer_id",
      validate: (id: number) => validateEmployeeRole(id, EmployeeRole.TRAINER, "trainer_id"),
    },
  ];
}

export default new ClasseService(ClasseEntity);
