import { defineConfig } from "eslint/config";
import eslintPluginPrettier from "eslint-plugin-prettier";
import tsParser from "@typescript-eslint/parser";
import tseslint from "@typescript-eslint/eslint-plugin";
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";


export default defineConfig([
  // Fully ignore generated and vendor folders
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.vitepress/cache/**",
      "packages/vue/src/icons/**",
    ],
  },
  {
    files: ["**/*.js", "**/*.ts", "**/*.vue"],
    ignores: ["**/dist/**", "**/node_modules/**", "**/.vitepress/cache/**"],
    plugins: {
      "@typescript-eslint": tseslint,
      prettier: eslintPluginPrettier,
      vue
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
        // Use a dedicated tsconfig for linting that includes all workspaces and Vue SFCs
        project: "./tsconfig.eslint.json",
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
          singleQuote: false,
          semi: true,
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "vue/html-self-closing": "off",
    },
  },
]);
