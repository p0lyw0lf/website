import { run_js, store } from "driver";
import { css } from "../render.js";

export default store(css`
  ${await run_js("src/css/dims.css.js", null)}
  ${await run_js("src/css/semanticColors.css.js", null)}

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background-color: var(--color-background-primary);
    color: var(--color-text-primary);
    font-size: var(--dim-font-regular);
  }
`);
