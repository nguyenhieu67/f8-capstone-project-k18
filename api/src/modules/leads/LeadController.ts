import { BaseController } from "@/common";
import LeadService from "./LeadService";

class LeadController extends BaseController {}

export default new LeadController(LeadService);
