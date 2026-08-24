import { BaseController } from "@/common";
import SourceService from "./SourceService";
import { toSourceDto } from "./SourceDto";

class SourceController extends BaseController {}

export default new SourceController(SourceService, toSourceDto);
