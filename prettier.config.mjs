/** @type {import("prettier").Config} */
export default {
  htmlWhitespaceSensitivity: "strict",
  plugins: ["prettier-plugin-astro"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};
