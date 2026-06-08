import { markdown_to_html, run_js } from "driver";
import { Base } from "../components/Base.js";
import { Header } from "../components/Header.js";
import { css, html } from "../render.js";

const { body, frontmatter } = ARG;
const slot = html`
  <div class="info">
    <h1 class="p-name">${frontmatter.title}</h1>
  </div>
  <article class="e-content">${await markdown_to_html(body)}</article>
`.withStyle(css`
  ${await run_js("src/css/MarkdownPage.css.js")}
  ${frontmatter.extraCss ? await run_js(`src/css/${frontmatter.extraCss}`) : ""}
`);
export default await Base(frontmatter)(slot, {
  header: await Header({ sectionTitle: "PolyWolf's Website", homeLink: "/" }),
});
