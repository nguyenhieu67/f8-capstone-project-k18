import { BaseService } from "./BaseService";
import { ClasseEntity } from "@/entities";
import { EmployeeRole } from "@/entities";
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
