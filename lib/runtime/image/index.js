import { run_js } from "driver";

/**
 * @param {import("./parseImage").Props} image
 */
export const parseImage = (image) =>
  /** @type {Promise<typeof import("./parseImage").default>} */ (
    run_js("lib/runtime/image/parseImage.js", image)
  );

/**
 * @param {import("./convertImage").Props} props
 */
export const convertImage = (props) =>
  /** @type {Promise<typeof import("./convertImage").default>} */ (
    run_js("lib/runtime/image/convertImage.js", props)
  );

/**
 * @param {import("./toAsset").Props} props
 */
export const toAsset = (props) =>
  /** @type {Promise<typeof import("./toAsset").default>} */ (
    run_js("lib/runtime/image/toAsset.js", props)
  );
