import { run_js } from "driver";
import { Base } from "../components/Base.js";
import { PostLink } from "../components/blog/PostLink.js";
import { Header } from "../components/Header.js";
import { blog } from "../content/config.js";
import { html } from "../render.js";

/** MUST be a file present inside `src/content/blog` ending with `.md` */
const posts = [
  "2613009.md",
  "2024-09-28-Write-Your-Own-Tools.md",
  "2024-02-01-up-and-to-the-right.md",
  "2024-11-24-A-Novel-Idea-About-Functor-In-Rust.md",
  "2025-04-14-Deriving-Functor-in-Rust.md",
  "2025-06-01-MTG-Draft-A-New-Beginner-s-Experience.md",
  "2025-09-26-Coho-Photo-Zine-Yes-and-ism.md",
  "2025-10-22-4-Unconventional-Ways-to-Cast-in-Typescript.md",
  "2026-02-23-So-Ive-Been-Thinking-About-Static-Site-Generators.md",
  "2026-04-29-This-World-Is-Not-Real.md",
  "2026-05-20-Erasing-Existentials.md",
];

const postLinks = await Promise.all(
  posts.map(async (post) => {
    const page = await blog.single(post);
    return await PostLink({
      title: page.frontmatter.title,
      published: page.frontmatter.published,
      tags: page.frontmatter.tags,
      slug: page.slug,
    });
  }),
);

const content = html`
  <p>
    I've posted a lot over the years, and been proud of nearly everything I've
    put out, but some posts have proven most popular/long-lasting than others.
    These are those posts. Not to toot my own horn too much, but I think these
    absolutely hold up still, do read them if you want!
  </p>
  <p>
    <ul>${postLinks.map((link) => html`<li>${link}</li>`)}</ul>
  </p>
`.withStyle(await run_js("src/css/MarkdownPage.css.js"));

// fobar
print(content.style);

const title = "Popular Posts";
export default await Base({
  pathname: "/popular/",
  title,
  description: 'A collection of some of my "greatest hits" as it were',
})(
  html`
    <div class="info"><h1 class="p-name">${title}</h1></div>
    <article class="e-content">${content}</article>
  `,
  {
    header: await Header({
      sectionTitle: "PolyWolf's Website",
      homeLink: "/blog/",
    }),
  },
);
