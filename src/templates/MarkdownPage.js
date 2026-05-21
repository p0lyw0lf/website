import { markdown_to_html, run_js } from "driver";
import { Base } from "../components/Base.js";
import { html } from "../render.js";

const { body, frontmatter } = ARG;
const slot = await markdown_to_html(body);
export default await Base(frontmatter)(
  html`${slot}`.withStyle(
    (await run_js("src/css/page.css.js", null)).toString(),
  ),
);
