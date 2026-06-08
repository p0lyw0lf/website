import { store } from "driver";
import { css } from "../render.js";
import {
  BREAKPOINT_DESKTOP,
  BREAKPOINT_IPAD,
  BREAKPOINT_IPHONE,
} from "./breakpoints.js";

export default store(css`
  body {
    font-family: "Arial Nova", "Helvetica Neue", Arial, Helvetica, sans-serif;
    background-color: var(--color-background-secondary);
    color: var(--color-text-secondary);

    display: flex;
    flex-direction: column;
  }

  header {
    background-color: var(--color-background-tertiary);
    color: var(--color-text-tertiary);

    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  header h2 {
    margin-top: 0;
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
  }
  main a {
    color: var(--color-text-primary-accent);
  }

  @media (min-width: ${BREAKPOINT_IPHONE}) {
    header {
      flex-direction: row;
      align-items: flex-end;
    }
  }

  @media (min-width: ${BREAKPOINT_IPAD}) {
    header {
      padding: 16px 32px;
    }

    main {
      margin: 0 32px;
      border: solid var(--dim-border) var(--color-border-primary);
    }
  }

  @media (min-width: ${BREAKPOINT_DESKTOP}) {
    body {
      flex-direction: row;
      min-height: 100vh;
      min-height: 100dvh;
    }

    header {
      flex-direction: column;
      align-items: flex-start;

      padding: 32px;
      width: 12rem;
    }

    main {
      margin: 32px 48px;
      align-self: flex-start;
      flex-grow: 1;
      max-width: 50rem;
    }
  }

  .info {
    background-color: var(--color-background-secondary);
    color: var(--color-text-secondary);

    padding: 16px;

    border-top: solid var(--dim-border) var(--color-border-primary);
    border-bottom: solid var(--dim-border) var(--color-border-primary);
  }

  .info h1 {
    margin: 4px 0;
  }

  @media (min-width: ${BREAKPOINT_IPAD}) {
    .info {
      border-top: none;
    }
  }

  article {
    padding: 0 16px;
  }
`);
