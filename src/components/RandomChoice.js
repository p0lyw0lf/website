import { minify_html, store } from "io";
import { html } from "../render.js";

/**
 * @callback Component
 * @param {object} props
 * @returns {import("../render.js").HTML}
 *
 * @typedef Props
 * @type {object}
 * @property {Component} Component
 * @property {Array.<object>} propChoices
 * @property {string} id
 */

/**
 * @param {Props} props
 * @returns {import("../render.js").HTML}
 */
export const RandomChoice = ({ Component, propChoices, id }) => {
  const htmlChoices = propChoices.map((props) => Component(props));

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
        ${htmlChoices
          .map((html) => {
            const minified = minify_html(store(html.toString()));
            return JSON.stringify(minified.toString());
          })
          .join(",")},
      ];
      const index = Math.floor(Math.random() * choices.length);
      elem.innerHTML = choices[index];
    </script>
  `;
};
