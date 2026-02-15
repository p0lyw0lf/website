import { store } from "io";
import { run_task } from "memoized";
import { SITE_URL } from "../data/urls.js";
import { html } from "../render.js";

/**
 * @typedef {object} Props
 * @property {string} title
 * @property {string} pathname
 * @property {string} [overrideTitle]
 * @property {string} [description]
 *
 * @typedef {object} Slots
 * @property {string} [extraHead]
 * @property {string} [header]
 * @property {string} [footer]
 *
 * @callback Render
 * @param {string} mainSlot
 * @param {Slots} [extraSlots]
 * @returns {import("io").StoreObject}
 */

/**
 * @param {Props} props
 * @returns {Render}
 */
export const Base =
  ({ title, pathname, overrideTitle, description }) =>
  (slot, extraSlots) => {
    const { extraHead, header, footer } = extraSlots ?? {};
    const canonicalUrl = `${SITE_URL}/${pathname}`;

    const fullTitle = overrideTitle ?? `wolfgirl.dev - ${title}`;

    const out = html`
      <!doctype html>
      <html lang="en-US">
        <head>
          <meta charset="utf-8" />
          <meta http-equiv="x-ua-compatible" content="ie=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <title>${fullTitle}</title>
          ${description &&
          html`<meta name="description" content="${description}" />`}

          <meta property="og:title" content="${title ?? "PolyWolf"}" />
          <meta property="og:site_name" content="wolfgirl.dev" />
          ${description &&
          html`<meta property="og:description" content="${description}" />`}
          <meta property="og:url" content="${canonicalUrl}" />
          <!-- TODO: automatic "og:image" property. Right now it just always uses the favicon which is not ideal. !-->
          <meta
            property="og:image"
            content="${`${SITE_URL}/apple-touch-icon.png`}"
          />

          <link rel="canonical" href="${canonicalUrl}" />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />

          ${extraHead}
          <style>
            ${run_task("../css/common.css.js", null)}
            ${extraHead?.style}
            ${slot.style}
            ${header?.style}
            ${footer?.style}
          </style>
        </head>
        <body>
          ${header ||
          html`<header>
            <h1><a href="/">${title || "idk"}</a></h1>
          </header>`}
          <main>${slot}</main>
          ${footer}
        </body>
      </html>
    `;

    return store(out.toString());
  };
