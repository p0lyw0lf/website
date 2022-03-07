import configPrettier from "eslint-config-prettier";
import pluginAstro from "eslint-plugin-astro";
import pluginEslint from "@eslint/js";
import pluginTypescript from "typescript-eslint";
import parserAstro from "astro-eslint-parser";
import parserTypescript from "@typescript-eslint/parser";

export default pluginTypescript.config(
  {
    ignores: ["dist/**", "node_modules/**", ".github/**", ".astro/**"],
  },
  pluginEslint.configs.recommended,
  ...pluginTypescript.configs.recommended,
  ...pluginAstro.configs.recommended,
  ...pluginAstro.configs["jsx-a11y-recommended"],
  configPrettier,
  {
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
  },
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: parserAstro,
      parserOptions: {
        parser: parserTypescript,
        extraFileExtensions: [".astro"],
      },
    },
  },
);
