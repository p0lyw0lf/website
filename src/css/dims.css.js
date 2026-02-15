import { store } from "io";
import { css } from "../render.js";
import { BREAKPOINT_DESKTOP, BREAKPOINT_IPAD } from "./breakpoints.js";

export default store(css`
  :root {
    --dim-font-regular: 1.25rem;
    --dim-font-large: 2rem;
    --dim-border: 1px;
  }

  @media (min-width: ${BREAKPOINT_IPAD}) {
    :root {
      --dim-font-regular: 1rem;
    }
  }

  @media (min-width: ${BREAKPOINT_DESKTOP}) {
    :root {
      --dim-font-regular: 0.875rem;
      --dim-font-large: 1.75rem;
    }
  }
`);
