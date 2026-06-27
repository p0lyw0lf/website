import { run_js } from "driver";
import { Post } from "../../../components/blog/Post.js";
import { PostLink } from "../../../components/blog/PostLink.js";
import { toArchiveUrl } from "../../../data/urls.js";
import { html } from "../../../render.js";

const getYear = (page) => {
  const epochPublished = Temporal.Instant.fromEpochMilliseconds(
    page.frontmatter.published * 1000,
  );
  const published = epochPublished.toZonedDateTimeISO("America/New_York");
  return published.year;
};

const getArchivePages = async () => {
  const pages = await run_js("./src/pages/blog/[slug].html.js", null);

  const byYear = new Map();
  for (const page of pages) {
    const year = getYear(page);
    const existing = byYear.get(year) ?? [];
    existing.push(page);
    byYear.set(year, existing);
  }
  return [...byYear.entries()].map(([year, pages]) => ({ year, pages }));
};

const rssLink = "/blog/rss.xml";

const buildArchivePage = async ({ year, pages }) => {
  const url = toArchiveUrl(year);
  const title = `Archive ${year}`;
  return await Post({
    pathname: url,
    homeLink: "/blog/",
    sectionTitle: "PolyWolf's Blog",
    rssLink,
    title,
    description: `All my blog post published in the year ${year}`,
  })(html`
    <div class="info">
      <h1>${title}</h1>
      <a href="/blog/archives/">All Years</a>
    </div>
    <ul>
      ${await Promise.all(
        pages.map(
          async (page) =>
            html`<li
              >${await PostLink({
                title: page.frontmatter.title,
                published: page.frontmatter.published,
                tags: page.frontmatter.tags,
                slug: page.slug,
              })}</li
            >`,
        ),
      )}
    </ul>
  `);
};

export default ARG ? await buildArchivePage(ARG) : await getArchivePages();
