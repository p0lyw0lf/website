import { run_task } from "driver";
import { html } from "../render.js";
import { Base } from "./Base.js";

/**
 * @typedef {object} Props
 * @property {string} title
 * @property {string} description
 *
 * @callback Render
 * @param {string} mainSlot
 * @returns {import("driver").StoreObject}
 */

/**
 * @param {Props} props
 * @returns {Render}
 */
export const MarkdownPage =
  ({ title, description }) =>
  (slot) =>
    Base({ title, description })(
      html`${slot}`.withStyle(run_task("../css/page.css.js", null).toString()),
    );
