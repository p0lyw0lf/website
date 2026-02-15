import { store } from "io";
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

    h2 {
      margin-top: 0;
    }

    a {
      color: var(--color-text-tertiary);
    }

    nav {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
  }

  main {
    background-color: var(--color-background-primary);
    color: var(--color-text-primary);
    line-height: 1.9em;

    padding: 0 16px;

    a {
      color: var(--color-text-primary-accent);
    }

    img {
      width: 100%;
    }

    pre {
      line-height: normal;
    }
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
      width: 10rem;
    }

    main {
      margin: 32px 48px;
      align-self: flex-start;
      flex-grow: 1;
      max-width: 50rem;
    }
  }

  code {
    font-family: Consolas, monaco, monospace;
    background-color: var(--color-background-secondary);
    color: var(--color-text-secondary-accent);
  }

  .astro-code code {
    background-color: inherit;
    color: inherit;
  }

  blockquote {
    margin-left: 0.2em;
    padding-left: 0.8em;
    border-left: 0.2em solid var(--color-text-secondary-accent);
    background-color: var(--color-background-secondary);
    color: var(--color-text-secondary);

    code {
      background-color: var(--color-background-primary);
      color: var(--color-text-secondary-accent);
    }
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
    padding: 4px 8px;
  }
`);
