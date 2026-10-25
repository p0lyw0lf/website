import { run_js } from "driver";
import { css, html } from "../../lib/html.js";
import { markdownToHtml } from "../../lib/runtime/index.js";
import { Base } from "../components/Base.js";
import { Header } from "../components/Header.js";
import MarkdownPageCss from "../css/MarkdownPage.css.js";

const { body, frontmatter, outputPath } = ARG;
let pathname = "/" + outputPath;
if (pathname.endsWith("index.html")) {
  pathname = pathname.slice(0, -"index.html".length);
}
const slot = html`
  <div class="info">
    <h1 class="p-name">${frontmatter.title}</h1>
  </div>
  <article class="e-content">${await markdownToHtml(body)}</article>
`.withStyle(css`
  ${MarkdownPageCss}
  ${frontmatter.extraCss ? await run_js(`src/css/${frontmatter.extraCss}`, null) : ""}
`);
export default await Base({ ...frontmatter, pathname })(slot, {
  header: await Header({ sectionTitle: "PolyWolf's Website", homeLink: "/" }),
});
