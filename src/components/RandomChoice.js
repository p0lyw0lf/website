import { html } from "../render.js";

/**
 * @callback Component
 * @param {object} props
 * @returns string
 *
 * @typedef Props
 * @type {object}
 * @property {Component} Component
 * @property {Array.<object>} propChoices
 * @property {string} id
 */

/**
 * @param {Props} props
 * @returns string
 */
export const RandomChoice = ({ Component, propChoices, id }) => {
  const htmlChoices = propChoices.map((props) => Component(props));

  return html`
    <div id="${id}">${htmlChoices[0]}</div>
    <script>
      const elem = document.getElementById("${id}");
      const choices = [
        ${htmlChoices.map((html) => JSON.stringify(html)).join(",")},
      ];
      const index = Math.floor(Math.random() * choices.length);
      elem.innerHTML = choices[index];
    </script>
  `;
};
