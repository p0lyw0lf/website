import { run_js, store } from "driver";

/** @typedef {import("../../../content/types").BlogPage} Props */

const list = () =>
  /** @type {Promise<Props[]>} */ (
    run_js("src/pages/blog/[slug].html.js", null)
  );

/**
 * @param {Props} page
 * @returns {Promise<import("driver").StoreObject>}
 */
const build = async ({ frontmatter }) => {
  const { title, tags } = frontmatter;
  return store(`TODO ${title} ${tags}`);
};

/** @type {Props | null} */
const page = ARG;
export default page ? await build(page) : await list();
