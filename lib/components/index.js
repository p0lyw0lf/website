import { run_js } from "driver";

/** @param {import("./Audio").Props} props */
export const Audio = (props) =>
  /** @type {Promise<typeof import("./Audio").default>} */ (
    run_js("lib/components/Audio.js", props)
  );

/** @param {import("./Image").Props} props */
export const Image = (props) =>
  /** @type {Promise<typeof import("./Image").default>} */ (
    run_js("lib/components/Image.js", props)
  );

/** @param {import("./Video").Props} props */
export const Video = (props) =>
  /** @type {Promise<typeof import("./Video").default>} */ (
    run_js("lib/components/Video.js", props)
  );
