import { css } from "../../lib/html.js";
import dimsCss from "./dims.css.js";
import semanticColorsCss from "./semanticColors.css.js";

export default css`
  ${dimsCss}
  ${semanticColorsCss}

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background-color: var(--color-background-primary);
    color: var(--color-text-primary);
    font-size: var(--dim-font-regular);
  }
`;
