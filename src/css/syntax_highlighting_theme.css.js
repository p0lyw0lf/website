import { store } from "driver";
import { css } from "../render.js";

export default store(css`
  /* "Eggbug Dark" base16 theme */
  :root {
    --b16-00: var(--color-off-black);
    --b16-01: var(--color-off-black);
    --b16-02: var(--color-dark-gray);
    --b16-03: rgb(110, 110, 108);
    --b16-04: var(--color-light-gray);
    --b16-05: var(--color-off-white);
    --b16-06: var(--color-white);
    --b16-07: var(--color-white);
    --b16-08: var(--color-strawberry);
    --b16-09: var(--color-mango);
    --b16-0a: var(--color-longan);
    --b16-0b: rgb(203, 240, 152);
    --b16-0c: rgb(182, 246, 238);
    --b16-0d: rgb(122, 168, 243);
    --b16-0e: rgb(232, 74, 146);
    --b16-0f: var(--color-cherry);
  }

  @media (prefers-color-scheme: light) {
    /* "Eggbug Light" base16 theme */
    :root {
      --b16-00: var(--color-off-white);
      --b16-01: var(--color-off-white);
      --b16-02: var(--color-light-gray);
      --b16-03: rgb(110, 110, 108);
      --b16-04: var(--color-dark-gray);
      --b16-05: var(--color-off-black);
      --b16-06: var(--color-black);
      --b16-07: var(--color-black);
      --b16-08: rgb(229, 107, 111);
      --b16-09: rgb(177, 89, 6);
      --b16-0a: rgb(130, 106, 28);
      --b16-0b: rgb(47, 81, 0);
      --b16-0c: rgb(0, 110, 96);
      --b16-0d: var(--color-blue);
      --b16-0e: var(--color-cherry);
      --b16-0f: var(--color-strawberry);
    }
  }

  .syntax-highlighting {
    background: var(--b16-00);
  }

  .comment,
  .punctuation.comment {
    color: var(--b16-03);
  }

  .punctuation,
  .keyword.operator,
  .syntax-highlighting {
    color: var(--b16-05);
  }

  .constant,
  .support.constant {
    color: var(--b16-09);
  }

  .entity {
    color: var(--b16-0a);
  }

  .string {
    color: var(--b16-0b);
  }

  .support,
  .string.regexp {
    color: var(--b16-0c);
  }

  .entity.function,
  .variable.function {
    color: var(--b16-0d);
  }

  .keyword,
  .storage {
    color: var(--b16-0e);
  }

  .invalid {
    color: var(--b16-0f);
  }
`);
