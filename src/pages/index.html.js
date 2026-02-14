import { RandomLandingPfp } from "../components/RandomLandingPfp.js";
import { html } from "../render.js";
import { Base } from "../templates/Base.js";

export default Base({
  title: "Home",
  overrideTitle: "wolfgirl.dev - PolyWolf",
  description:
    "Landing page for PolyWolf's personal website. I'm a wolfgirl and software engineer",
})(
  html`
    ${RandomLandingPfp()}
    <nav class="bignav">
      <a href="art/">Art</a>
      <a href="blog/">Blog</a>
      <a href="cybersec/">Cybersec</a>
      <a href="links/">Links</a>
      <a href="projects/">Projects</a>
      <a href="friends/">Friends</a>
    </nav>
    <main>
      <p>
        Hi! I'm a wolfgirl and software engineer. This is my website!
        Mobile-first design because i use my phone all the time! Monospace font
        everywhere because i like it! Inconsistent capitalization because it's
        fun!
      </p>
      <h2>Navigation</h2>
      <p>
        Top header is a link that takes you to the previous page. "Blog" and
        "Cybersec" have a bit better styling on them, rest are pretty silly tho
        :P
      </p>
    </main>
  `,
  {
    header: html`
      <header>
        <h1>
          <a href="about/">HI I'M POLYWOLF</a>
        </h1>
      </header>
    `,
    footer: html`
      <footer><em>Thank you for visiting my website!</em></footer>
    `,
  },
);
