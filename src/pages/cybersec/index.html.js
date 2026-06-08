import { read_file, run_js } from "driver";
import { Post } from "../../components/blog/Post.js";
import { CybersecLink } from "../../components/cybersec/CybersecLink.js";
import { SITE_URL } from "../../data/urls.js";
import { css, html } from "../../render.js";

const posts = await run_js("src/pages/cybersec/[slug].html.js", null);
const rssLink = `${SITE_URL}/cybersec/rss.xml`;

export default await Post({
  sectionTitle: "PolyWolf on Security",
  homeLink: "/cybersec/",
  title: "Cybersecurity",
  description:
    'A list of links that PolyWolf has curated to be "cool" and under the vauge collection of having to do with computer security',
})(
  html`
    <div class="info">
      <h1 class="p-name">Cybersec</h1>
    </div>
    <article>
      <h1>NONE OF THIS CONTENT IS MY OWN</h1>
      <p>
        This is a list of links that I've been posting to a random Discord
        channel for a cybersecurity class I was in. The server is fairly
        inactive (but ppl still read the channel!) and keeping things
        exclusively on Discord is bad, so I wrote a
        <a href="https://github.com/p0lyw0lf/crossposter">Discord bot</a> that
        mirrors activity in the channel to this page, a
        <a href="https://infosec.exchange/@PolyWolf">Mastodon account</a>, &amp;
        an
        <a href="${rssLink}" id="rss"
          >RSS feed ${await read_file("public/rss.svg")}</a
        >
      </p>
      <ul>
        ${posts.map(
          (post) =>
            html`<li>
              ${CybersecLink({
                slug: post.slug,
                title: post.frontmatter.title,
                repost_link: post.frontmatter.repost_link,
              })}
            </li>`,
        )}
      </ul>
    </article>
  `.withStyle(css`
    #rss svg {
      height: 1em;
      margin-left: 0.25em;
    }
  `),
);
