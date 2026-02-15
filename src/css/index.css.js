import { run_task, store } from "driver";
import { css } from "../render.js";

export default store(css`
  ${run_task("./page.css.js", null)}

  #pfp {
    margin: 0;
    margin-bottom: 2em;
  }

  .bignav {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75em;
    margin-bottom: 2em;
    a {
      font-size: 2em;
      font-weight: 600;
      text-transform: uppercase;
    }
  }
`);
