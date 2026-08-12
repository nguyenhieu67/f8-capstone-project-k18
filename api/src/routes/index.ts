import { Router } from "express";
import { readdirSync } from "fs";

const router = Router();
const postFix = ".route.ts";

const routeFiles = readdirSync(__dirname).filter((name) =>
  name.endsWith(postFix),
);

(async () => {
  for (const fileName of routeFiles) {
    const resource = fileName.replace(postFix, "");
    const routeModule = await import(`./${fileName}`);
    if (!routeModule.default) {
      console.warn(`⚠️ ${fileName} thiếu export default, bỏ qua`);
      continue;
    }
    router.use(`/${resource}`, routeModule.default);
  }
})();

export default router;
