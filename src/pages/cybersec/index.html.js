import { run_task } from "driver";
import { CybersecLink } from "../../components/cybersec/CybersecLink.js";
import { html } from "../../render.js";
import { Post } from "../../templates/Post.js";

const posts = await run_task("src/pages/cybersec/[slug].html.js", null);
// Sorting by slug is like sorting by date, effectively
posts.sort((a, b) => b.slug.localeCompare(a.slug));

export default await Post({
  sectionTitle: "PolyWolf on Security",
  homeLink: "/cybersec/",
  title: "Cybersecurity",
  description:
    'A list of links that PolyWolf has curated to be "cool" and under the vauge collection of having to do with computer security',
})(html`
  <h1>NONE OF THIS CONTENT IS MY OWN</h1>
  <p>
    This is a list of links that I've been posting to a random Discord channel
    for a cybersecurity class I was in. The server is fairly inactive (but ppl
    still read the channel!) and keeping things exclusively on Discord is bad,
    so I wrote a
    <a href="https://github.com/p0lyw0lf/crossposter">Discord bot</a> that
    mirrors activity in the channel to this page and a
    <a href="https://infosec.exchange/@PolyWolf">Mastodon account</a>.
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
`);
