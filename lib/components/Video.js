import { store } from "driver";
import { externalReplacementUrl } from "../data/urls.js";
import { html } from "../html.js";

/**
 * @typedef {object} Props
 * @property {string} url
 */

/** @type {Props} */
const { url } = ARG;

const src = externalReplacementUrl(url) ?? url;

export default store(html`<video src="${src}" controls></video>`.toString());
