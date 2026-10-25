import { css } from "../../lib/html.js";
import { BREAKPOINT_IPAD } from "./breakpoints.js";

export default css`
  .info h1 {
    margin: 8px 0;
  }

  .tags {
    background-color: var(--color-background-secondary);
    color: var(--color-text-secondary);

    padding: 16px;

    border-top: solid var(--dim-border) var(--color-border-primary);
    border-bottom: solid var(--dim-border) var(--color-border-primary);
  }

  .tags:not(:last-child) {
    border-bottom: none;
  }

  .comments {
    padding: 16px;

    border-top: solid var(--dim-border) var(--color-border-primary);
    border-bottom: solid var(--dim-border) var(--color-border-primary);
  }

  .tags,
  .comments {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  @media (min-width: ${BREAKPOINT_IPAD}) {
    .tags,
    .comments {
      border-bottom: none;
    }
  }
`;
