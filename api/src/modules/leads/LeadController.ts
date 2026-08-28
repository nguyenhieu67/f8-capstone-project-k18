import { BaseController } from "@/common";
import leadService from "./LeadService";

class LeadController extends BaseController {}

export default new LeadController(leadService);
