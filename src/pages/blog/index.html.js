import { html } from "../../render.js";
import { Post } from "../../templates/Post.js";

export default Post({
  sectionTitle: "PolyWolf's Blog",
  homeLink: "/blog/",
  title: "Blog",
  description: "The homepage for my blog",
})(html`
  <p>I have a blog! There may be many blogs like it, but this one is mine!</p>
`);
