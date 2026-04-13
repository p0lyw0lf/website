import { run_task } from "driver";
import { cybersec } from "../../content/config.js";
import { html } from "../../render.js";
import { Cybersec } from "../../templates/Cybersec.js";

const getPages = async () => {
  return Object.values(await cybersec());
};

const buildPage = async ({ frontmatter, body, slug }) => {
  const { title, repost_link } = frontmatter;
  return await Cybersec({ slug, title, repost_link, date: slug.slice(0, 10) })(
    html`<article class="e-content"
      >${await run_task("src/runtime/markdown.js", body)}</article
    >`,
  );
};

export default ARG ? await buildPage(ARG) : await getPages();
