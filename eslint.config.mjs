import astroParser from "astro-eslint-parser";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import globals from "globals";
import js from "@eslint/js";
import ts from "typescript-eslint";

export default [
  js.configs.recommended,
  /*
  ...ts.config({
    extends: ts.configs.recommendedTypeChecked,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  }),
  */
  ...ts.configs.recommended,
  ...eslintPluginAstro.configs["recommended"],
  ...eslintPluginAstro.configs["jsx-a11y-recommended"],
  eslintConfigPrettier,
  eslintPluginPrettier,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },
    },
  },
  {
    ignores: ["dist/**", "node_modules/**", ".github/**", ".astro/**"],
  },
];
