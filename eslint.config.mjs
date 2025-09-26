import { defineConfig } from "eslint/config";
import eslintPluginPrettier from "eslint-plugin-prettier";
import tsParser from "@typescript-eslint/parser";
import tseslint from "@typescript-eslint/eslint-plugin";
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";

export default defineConfig([
  {
    files: ["**/*.js", "**/*.ts", "**/*.vue"],
    ignores: ["**/dist/**", "**/node_modules/**", "**/*.d.ts"],
    plugins: {
      "@typescript-eslint": tseslint,
      prettier: eslintPluginPrettier,
      vue,
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: new URL('.', import.meta.url).pathname,
        extraFileExtensions: [".vue"],
      },
    },
    rules: {
      ...vue.configs["flat/essential"].rules,
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
          printWidth: 120,
          htmlWhitespaceSensitivity: "ignore",
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "vue/html-self-closing": "off",
    },
  },
]);
