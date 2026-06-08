import { run_js, store } from "driver";
import { css } from "../render.js";
import { BREAKPOINT_DESKTOP } from "./breakpoints.js";

export default store(css`
  ${await run_js("./src/css/MarkdownPage.css.js", null)}

  main img {
    width: 100%;
    height: auto;
  }
  main pre {
    line-height: normal;
  }

  /* I don't use <h1> in article bodies, but let's include this rule anyways just in case */
  h1 a.anchor::before {
    content: "#";
  }
  h2 a.anchor::before {
    content: "#";
  }
  h3 a.anchor::before {
    content: "##";
  }
  h4 a.anchor::before {
    content: "###";
  }
  h5 a.anchor::before {
    content: "####";
  }
  h5 a.anchor::before {
    content: "#####";
  }
  a.anchor::before {
    padding-right: 0.2em;
  }

  /* Images that can be clicked to show the full resolution */
  /* TODO: composable stylesheet because this is also used in the art part? */
  button.show {
    font-family: inherit;
    font-size: inherit;

    padding: 0;
    border: var(--color-border-primary) solid var(--dim-border-thick);
    display: flex;
    width: 100%;
  }

  dialog {
    background: var(--color-background-secondary);
    color: var(--color-text-secondary);
    width: 100dvw;
    height: 100dvh;
    border: 0;
    padding: 16px;
  }

  @media (min-width: ${BREAKPOINT_DESKTOP}) {
    dialog {
      max-width: min(90dvw, 1124px);
      max-height: 90dvh;
      border: var(--color-text-secondary-accent) solid var(--dim-border-thick);
    }
  }

  button.hide {
    font-family: inherit;
    font-size: inherit;

    background: none;
    color: var(--color-text-secondary);
    border: var(--color-text-secondary-accent) solid var(--dim-border-thick);
    padding: 4px 8px;
  }

  dialog figure {
    width: 100%;
    margin: 16px 0 0 0;
  }

  dialog figure img {
    object-fit: contain;
    border: var(--color-border-primary) solid var(--dim-border-thick);
  }

  /* Stop scrolling body when popover is shown */
  body:has(:popover-open) {
    overflow: hidden;
  }

  /* Code blocks */
  code {
    font-family: Consolas, monaco, monospace;
    background-color: var(--color-background-secondary);
    color: var(--color-text-secondary-accent);
  }

  .syntax-highlighting {
    overflow: auto;
    padding: 16px;
  }
  .syntax-highlighting code {
    background-color: inherit;
    color: inherit;
  }
  ${await run_js("src/css/syntaxHighlightingTheme.css.js", null)}

  /* Make details/summary look similar to blockquote */
  blockquote, details {
    margin: 1em 0;
    padding-left: 0.8em;
    padding-right: 0.5em;
    background-color: var(--color-background-secondary);
    color: var(--color-text-secondary);
    border-left: 0.2em solid;
  }

  details {
    border-left-color: var(--color-background-secondary);
  }

  blockquote,
  details[open] {
    border-left-color: var(--color-text-secondary-accent);
  }

  /* inline code on a different-colored background should look different. */
  blockquote code,
  details code {
    background-color: var(--color-background-primary);
    color: var(--color-text-secondary-accent);
  }

  /* reduce margins for lists at the top-level of the quoted elements */
  blockquote > ul,
  blockquote > ol,
  details > ul,
  details > ol {
    margin-left: -0.8em;
  }

  /* Make it so that on mobile, when tables are too wide, they scroll horizontally */
  .table-wrapper {
    overflow: scroll;
  }

  /* Basic table styling. Put a border around the outside, and have no borders on the inside. */
  table {
    border: var(--color-border-primary) solid 1px;
    border-collapse: collapse;
  }

  /* Make it so that <table class="first-is-label"> will have a border betweent the first column and everything else */
  table.first-is-label tr :first-child {
    border-right: var(--color-border-primary) solid 1px;
  }

  /* Make it so that alternating rows are colored differently */
  thead,
  tbody tr:nth-child(even) {
    background-color: var(--color-background-secondary);
  }

  /* Add a fancy border-bottom to the table header */
  thead {
    border-bottom: var(--color-border-primary) double 3px;
  }

  /* Add a bit of extra breathing room to each cell */
  td {
    padding: 8px 16px;
  }

  th {
    padding: 4px 16px;
  }

  .katex:only-child {
    display: inline-block;
    width: 100%;
    text-align: center;
  }

  .footnotes {
    border-top: var(--color-border-primary) solid 1px;
  }

  .footnotes::before {
    content: "Footnotes";
    display: block;
    font-size: 1.5em;
    font-weight: bold;
    margin-top: 0.7em;
  }
`);
