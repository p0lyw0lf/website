import { store } from "io";
import { run_task } from "memoized";
import { css } from "../render.js";

export default store(css`
  ${run_task("./dims.css.js", null)}
  ${run_task("./semantic_colors.css.js", null)}

  body {
    margin: 0;
    background-color: var(--color-background-primary);
    color: var(--color-text-primary);
    font-size: var(--dim-font-regular);
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    a {
      text-decoration: none;
    }
  }
`);
