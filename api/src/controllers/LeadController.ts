import { leadService } from "@/services";
import { BaseController } from "./BaseController";

class LeadController extends BaseController {}

export default new LeadController(leadService);
