import { run_js } from "driver";
import { build, dynamic } from "../../../lib/build/index.js";

/** @type {string} */
const dir = ARG;

const list = () =>
  /** @type {Promise<typeof import("./_list.js").default>} */ (
    run_js(`${dir}/_list.js`, null)
  );

/** @param {import("./_page.js").Props} page */
const buildPage = (page) =>
  /** @type {Promise<typeof import("./_page.js").default>} */ (
    run_js(`${dir}/_page.js`, page)
  );

await Promise.all([
  build(dir),
  dynamic(list, buildPage, (page) => page.outputPath),
]);
