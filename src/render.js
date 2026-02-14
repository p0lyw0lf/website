/**
 * @callback WithStyle
 * @param {string} css - The style to put in the <head> of the HTML
 * @returns {HTML}
 *
 * @typedef {string} HTML
 * @property {WithStyle} withStyle - Stores some CSS for retrieval later.
 * @property {string} style - All the styles read so far from the interpolation/withStyle calls.
 */

/**
 * Tag template function for convenience. Should probably be written in Rust instead but ah well
 * I love self-hosted cores.
 *
 * USAGE:
 * ```
 * const x = html`foo${false}bar${undefined}baz${null}qux`;
 * assert(x === "foobarbazqux");
 * ```
 *
 * That is, any naively-falsey value will be removed entirely, except for the digit zero.
 * Arrays will be automatically flattened.
 *
 * @param {Array.<string>} strings
 * @param {...unknown} exprs
 * @returns {HTML}
 */
export const html = (strings, ...exprs) => {
  const output = [];
  const style = [];
  for (let i = 0; i / 2 < strings.length; i += 1) {
    if (i % 2 === 0) {
      output.push(strings[i / 2]);
    } else {
      const expr = exprs[(i - 1) / 2];
      output.push(asPrintable(expr));
      if (expr !== undefined && expr !== null && Object.hasOwn(expr, "style")) {
        style.push(expr.style);
      }
    }
  }
  return Object.assign(output.join(""), {
    style: style.join(""),
    withStyle: function (moreStyle) {
      this.style += moreStyle;
    },
  });
};

/**
 * Just like [html], but provides hints to the formatter that we're doing CSS now, and also doesn't support [WithStyle] anymore.
 *
 * @param {Array.<string>} strings
 * @param {...unknown} exprs
 * @returns {string}
 */
export const css = (strings, ...exprs) => {
  const output = [];
  for (let i = 0; i / 2 < strings.length; i += 1) {
    if (i % 2 === 0) {
      output.push(strings[i / 2]);
    } else {
      const expr = exprs[(i - 1) / 2];
      output.push(asPrintable(expr));
    }
  }
  return output.join("");
};

/**
 * @param {unknown} value
 * @returns {string}
 */
const asPrintable = (value) => {
  if (value === false || value === undefined || value === null) {
    return "";
  }
  if (Array.isArray(value)) {
    return value.map(asPrintable).join("");
  }
  return String(value);
};
