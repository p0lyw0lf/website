import { run_js } from "driver";
import { Base } from "../components/Base.js";
import { RandomLandingPfp } from "../components/RandomLandingPfp.js";
import { html } from "../render.js";

export default await Base({
  title: "Home",
  pathname: "/",
  overrideTitle: "wolfgirl.dev - PolyWolf",
  description:
    "Landing page for PolyWolf's personal website. I'm a wolfgirl and software engineer",
})(
  html`
    ${await RandomLandingPfp()}
    <nav class="bignav">
      <a href="links/">Links</a>
      <a href="art/">Art</a>
      <a href="blog/">Blog</a>
      <a href="cybersec/">Cybersec</a>
      <a href="projects/">Projects</a>
    </nav>
    <p>
      Hi! I'm a wolfgirl and software engineer. This is my website! Mobile-first
      design because i use my phone all the time! System font everywhere because
      i like it! Inconsistent capitalization because it's fun!
    </p>
  `.withStyle(await run_js("src/css/Index.css.js")),
  {
    extraHead: html`
      <link rel="me" href="https://social.treehouse.systems/@PolyWolf" />
    `,
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
