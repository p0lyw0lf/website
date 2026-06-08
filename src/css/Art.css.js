import { store } from "driver";
import { css } from "../render.js";

export default store(css`
  body {
    font-family: Consolas, monaco, monospace;
    background-color: var(--color-background-secondary);
  }

  p,
  ul,
  ol {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }

  ul li,
  ol li {
    margin-bottom: 0.5em;
  }

  header,
  main,
  footer {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  a {
    color: var(--color-text-primary-accent);
  }

  main {
    max-width: none;
    padding: 16px 48px;
    margin: auto;
    align-items: stretch;
  }

  .grid {
    display: grid;
    grid: auto-flow / repeat(auto-fit, minmax(calc(256px + 16px + 2px), 1fr));
  }
`);
