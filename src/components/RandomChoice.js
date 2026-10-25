import { store } from "driver";
import { html } from "../../lib/html.js";
import { minifyHtml } from "../../lib/runtime/index.js";

/**
 * @callback Component
 * @param {object} props
 * @returns {Promise<import("../../lib/html_types").HTML>}
 *
 * @typedef Props
 * @type {object}
 * @property {Component} Component
 * @property {Array.<object>} propChoices
 * @property {string} id
 */

/**
 * @param {Props} props
 * @returns {Promise<import("../../lib/html_types").HTML>}
 */
export const RandomChoice = async ({ Component, propChoices, id }) => {
  const htmlChoices = await Promise.all(
    propChoices.map(async (props) => await Component(props)),
  );

  return html`
    <div id="${id}">
      ${
        // Assume that the styles will be the same for all renders
        htmlChoices[0]
      }
    </div>
    <script>
      const elem = document.getElementById("${id}");
      const choices = [
        ${(
          await Promise.all(
            htmlChoices.map(async (html) => {
              const minified = await minifyHtml(store(html.toString()));
              return JSON.stringify(minified.toString());
            }),
          )
        ).join(",")},
      ];
      const index = Math.floor(Math.random() * choices.length);
      elem.innerHTML = choices[index];
    </script>
  `;
};
