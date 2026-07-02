import { store } from "driver";
import { css } from "../render.js";

export default store(css`
  .buttonwall {
    display: grid;
    grid: none / repeat(auto-fit, calc(88px + 4px));
    gap: 4px;
  }

  .buttonwall img {
    box-sizing: content-box;
    width: 88px;
    height: 31px;
    image-rendering: pixelated;
  }

  .buttonwall.large {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .buttonwall.large > img {
    width: auto;
    height: auto;
    border: solid 8px;
    border-color: lightgray darkgray darkgray lightgray;
  }

  .copy {
    display: grid;
    grid-template-columns: 1fr auto;
    max-width: 30rem;
  }

  /* Make it look like a code block */
  .copy > input {
    font-family: Consolas, monaco, monospace;
    background-color: var(--color-background-secondary);
    color: var(--color-text-secondary-accent);
    border: none;
  }

  .copy > button {
    background-color: var(--color-background-secondary);
    color: var(--color-text-secondary);

    width: 3em;
    height: 3em;

    border: solid 2px;
    border-color: lightgray darkgray darkgray lightgray;
  }

  .copy > button[data-state="ok"] {
    color: green;
  }

  .copy > button[data-state="error"] {
    color: red;
  }

  .copy > button > svg {
    width: 1.5em;
    height: 1.5em;
  }
`);
