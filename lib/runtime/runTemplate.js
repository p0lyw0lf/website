import { run_js, run_tera } from "driver";
import { PAGE_ROOT, PUBLIC_ROOT, VAULT_ROOT } from "../../CONFIG.js";

/**
 * @typedef {object} Props
 * @property {string} template
 * @property {import("./types.js").Page} page
 */
/** @type {Props} */
const { template, page } = ARG;

/**
 * @type {import("driver").StoreObject}
 */
export default template.endsWith(".js")
  ? await run_js(template, page)
  : await run_tera(template, {
      // We don't pass anything aside from currentPage, because otherwise prop
      // drilling becomes very difficult.
      currentPage: { ...page, PAGE_ROOT, PUBLIC_ROOT, VAULT_ROOT },
    });
