/** @typedef {import("./html_types").HTML} HTML */

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
 * @param {TemplateStringsArray} strings
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
      style.push(asStyleable(expr));
    }
  }
  return Object.assign(output.join(""), {
    style: style.join(""),
    /** @param {string} moreStyle */
    withStyle: function (moreStyle) {
      this.style += moreStyle;
      return this;
    },
    asJSON: function () {
      const s = this.asString();
      return JSON.stringify(s);
    },
    asString: function () {
      return String(this);
    },
  });
};

/**
 * Just like [html], but provides hints to the formatter that we're doing CSS now, and also doesn't support [WithStyle] anymore.
 *
 * @param {TemplateStringsArray} strings
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

/**
 * @param {unknown} value
 * @returns {string}
 */
const asStyleable = (value) => {
  if (value === undefined || value === null) {
    return "";
  }
  if (
    typeof value === "object" &&
    "style" in value &&
    typeof value.style === "string"
  ) {
    return value.style;
  }
  if (Array.isArray(value)) {
    const styles = value.map(asStyleable);
    return styles.join("");
  }
  return "";
};

/**
 * Escapes a string so it's OK to put inside an HTML attribute.
 *
 * @param {unknown} s
 * @returns {string}
 */
export const attribute = (s) => {
  return `"${String(s).replaceAll('"', "&quot;")}"`;
};

/**
 * Escapes an entire set of attributes. Purely for convenience.
 *
 * @param {Record<string, unknown>} o
 * @returns {string}
 */
export const attributes = (o) => {
  const attrs = [];
  for (const [key, value] of Object.entries(o)) {
    if (value !== false && value !== undefined && value !== null) {
      attrs.push(`${key}=${attribute(value)}`);
    }
  }
  return attrs.join(" ");
};
