import { run_task } from "driver";
import { ArtImage } from "../components/art/ArtImage.js";
import { art } from "../content/config.js";
import { css, html } from "../render.js";
import { Base } from "../templates/Base.js";

const artPosts = await art();
const sortedArt = Object.values(artPosts).sort(
  (a, b) => b.frontmatter.published - a.frontmatter.published,
);

export default await Base({
  pathname: "/art/",
  title: "Art",
  description:
    "Collection of art references for me, PolyWolf! I put all my commissions here, as well as the occasional art I do myself :)",
})(
  html`
    <p>Click on each image for more info!</p>
    <div class="grid">
      ${await Promise.all(sortedArt.map(async (post) => ArtImage({ post })))}
    </div>
    <p>
      ...and I don't really want to show any earlier ones since the reference
      has changed a lot, and I was <em>much</em> worse at art too :P. If you do
      really want to see <i>everything</i>, see
      <a
        href="https://www.deviantart.com/p0lyw0lf/gallery/78254173/polywolf"
        rel="noopener"
        target="_blank"
        >my deviantart gallery</a
      >.
    </p>
  `.withStyle(css`
    ${await run_task("src/css/page.css.js", null)}

    main {
      max-width: none;
      padding: 16px 48px;
      align-items: stretch;
    }

    .grid {
      display: grid;
      grid: auto-flow / repeat(auto-fit, minmax(calc(256px + 16px + 2px), 1fr));
    }
  `),
);
