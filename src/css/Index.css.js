import { store } from "driver";
import { css } from "../render.js";
import { BREAKPOINT_DESKTOP } from "./breakpoints.js";

export default store(css`
  body {
    font-family: "Arial Nova", "Helvetica Neue", Arial, Helvetica, sans-serif;
    background-color: var(--color-background-secondary);
    color: var(--color-text-secondary);

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  header {
    align-self: stretch;
    background-color: var(--color-background-tertiary);
    color: var(--color-text-tertiary);

    padding: 0 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  header a {
    color: var(--color-text-tertiary);
  }
  header nav {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  main {
    background-color: var(--color-background-primary);
    color: var(--color-text-primary);
    line-height: 1.9em;

    padding: 0 16px;
  }
  main a {
    color: var(--color-text-primary-accent);
  }

  @media (min-width: ${BREAKPOINT_DESKTOP}) {
    main {
      max-width: 50rem;
    }
  }

  #pfp {
    margin: 2em 0;
  }

  .bignav {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75em;
    margin-bottom: 2em;
  }
  .bignav a {
    font-size: 2em;
    font-weight: 600;
    text-transform: uppercase;
  }

  footer {
    margin: 1em;
  }
`);
