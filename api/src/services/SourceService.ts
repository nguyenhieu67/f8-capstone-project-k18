import { SourceEntity } from "@/entities";
import { BaseService } from "./BaseService";

class SourceService extends BaseService {}

const sourceService = new SourceService(SourceEntity);

export default sourceService;
