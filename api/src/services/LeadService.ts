import { BaseService } from "./BaseService";
import { LeadEntity, EmployeeRole } from "@/entities";
import { validateEmployeeRole } from "./helpers/validateEmployeeRole";

class LeadService extends BaseService {
  protected fkValidators = [
    {
      field: "sellerId",
      validate: (id: number) => validateEmployeeRole(id, EmployeeRole.SALE, "sellerId"),
    },
  ];
}

export default new LeadService(LeadEntity);
