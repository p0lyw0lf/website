import { run_task, store } from "driver";
import { css } from "../render";

export default store(css`
  ${run_task("./palette_colors.css.js", null)}

  /* Dark theme by default */
:root {
    /*
   * Backgrounds are ordered from back to front
   */
    --color-background-primary: var(--color-black);
    --color-background-secondary: var(--color-off-black);
    --color-background-tertiary: var(--color-cherry);

    /*
   * Each of these text colors goes on the aforementioned background color
   */
    --color-text-primary: var(--color-white);
    --color-text-primary-accent: var(--color-longan);
    --color-text-secondary: var(--color-off-white);
    --color-text-secondary-accent: var(--color-strawberry);
    --color-text-tertiary: var(--color-longan);

    --color-border-primary: var(--color-dark-gray);
  }

  @media (prefers-color-scheme: light) {
    :root {
      --color-background-primary: var(--color-white);
      --color-background-secondary: var(--color-off-white);
      /* --color-background-tertiary: */

      --color-text-primary: var(--color-black);
      --color-text-primary-accent: var(--color-blue);
      --color-text-secondary: var(--color-off-black);
      --color-text-secondary-accent: var(--color-cherry);
      /* --color-text-tertiary: */

      --color-border-primary: var(--color-light-gray);
    }
  }
`);
