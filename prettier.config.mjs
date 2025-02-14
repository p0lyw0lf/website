/** @type {import("prettier").Config} */
export default {
  htmlWhitespaceSensitivity: "strict",
  plugins: ["prettier-plugin-astro", "prettier-plugin-organize-imports"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
    {
      files: "*.mdoc",
      options: {
        parser: "markdown",
      },
    },
  ],
};
