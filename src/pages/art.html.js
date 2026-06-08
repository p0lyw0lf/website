import { run_js } from "driver";
import { ArtImage } from "../components/art/ArtImage.js";
import { Base } from "../components/Base.js";
import { art } from "../content/config.js";
import { html } from "../render.js";

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
  `.withStyle(await run_js("./src/css/Art.css.js")),
);
