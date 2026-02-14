import { minify_html, write_output } from "io";
import { Post } from "../templates/Post.js";
import { html } from "../render.js";

const rendered = Post({
  sectionTitle: "PolyWolf's Blog",
  homeLink: "/blog/",
  title: "Blog",
  description: "The homepage for my blog",
})(html`
  <p>I have a blog! There may be many blogs like it, but this one is mine!</p>
`);

write_output(ARGS[0], minify_html(rendered));
