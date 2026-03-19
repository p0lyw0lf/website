import { markdown_to_html } from "driver";
import { TagLink } from "../../components/blog/TagLink.js";
import { blog } from "../../content.js";
import { atprotoPostUrl, toBlogUrl } from "../../data/urls.js";

const getPages = async () => {
  const fileLoaders = await blog();
  const files = await Promise.all(Object.values(fileLoaders));
  return files;
};

const buildPage = async ({ frontmatter, body, slug }) => {
  const { title, description, mastodon, bluesky } = frontmatter;
  const blueskyUrl = atprotoPostUrl(bluesky);
  const published = new Date(frontmatter.published * 1000);
  const url = toBlogUrl(slug);

  return await Post({
    pathname: url,
    homeLink: "/blog/",
    sectionTitle: "PolyWolf's Blog",
    title,
    description,
  })(html`
    <div class="info">
      <h1 class="p-name">${title}</h1>
      <span
        >Published:
        <time class="dt-published" datetime="${published.toISOString()}"
          >${published.toLocaleString("en-US", {
            timeZone: "America/New_York",
          })}</time
        >
      </span>
    </div>
    <article class="e-content">${await markdown_to_html(body)}</article>
    <div class="tags">${tags.map((tag) => TagLink({ tag }))}</div>
    ${(mastodon || blueskyUrl) &&
    html`
      <div class="comments">
        ${data.mastodon && html`<a href="${mastodon}">Comment on Mastodon</a>`}
        ${blueskyUrl && html`<a href="${blueskyUrl}">Comment on Bluesky</a>`}
      </div>
    `}
  `);
};

export default ARG ? await buildPage(ARG) : await getPages();
