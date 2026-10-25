import { PAGE_ROOT, PUBLIC_ROOT } from "./CONFIG.js";
import { build, copy } from "./lib/build/index.js";

await Promise.all([
  build(PAGE_ROOT),
  copy({ inputPath: PUBLIC_ROOT, root: PUBLIC_ROOT }),
]);
