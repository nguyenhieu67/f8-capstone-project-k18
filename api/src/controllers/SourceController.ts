import { sourceService } from "@/services";
import { BaseController } from "./BaseController";

class SourceController extends BaseController {}

export default new SourceController(sourceService);
