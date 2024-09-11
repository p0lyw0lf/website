module.exports = {
  env: {
    node: true,
    es2022: true,
    browser: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:astro/recommended",
    "plugin:astro/jsx-a11y-recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:prettier/recommended",
  ],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    extraFileExtensions: [".astro"],
  },
  overrides: [
    {
      files: ["*.astro"],
      parser: "astro-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },
    },
  ],
};
