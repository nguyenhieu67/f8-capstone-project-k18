import { BaseService } from "./BaseService";
import { LeadEntity } from "@/entities";
import { EmployeeRole } from "@/entities";
import { validateEmployeeRole } from "./helpers/validateEmployeeRole";

class LeadService extends BaseService {
  protected fkValidators = [
    {
      field: "seller_id",
      validate: (id: number) => validateEmployeeRole(id, EmployeeRole.SALE, "seller_id"),
    },
  ];
}

export default new LeadService(LeadEntity);
