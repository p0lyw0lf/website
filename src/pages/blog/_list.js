import { blog } from "../../content/config.js";

const pages = await blog.all();
export default pages.sort(
  (a, b) => b.frontmatter.published - a.frontmatter.published,
);
