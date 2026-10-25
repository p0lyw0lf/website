import { css } from "../../lib/html.js";
import { BREAKPOINT_DESKTOP, BREAKPOINT_IPAD } from "./breakpoints.js";

export default css`
  :root {
    --dim-font-regular: 1.1875rem;
    --dim-font-large: 2rem;
    --dim-border: 1px;
    --dim-border-thick: 4px;
  }

  @media (min-width: ${BREAKPOINT_IPAD}) {
    :root {
      --dim-font-regular: 1.125rem;
    }
  }

  @media (min-width: ${BREAKPOINT_DESKTOP}) {
    :root {
      --dim-font-regular: 1rem;
    }
  }
`;
