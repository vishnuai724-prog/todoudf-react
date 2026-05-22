import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import boundaries from "eslint-plugin-boundaries";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),

  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
      ],
    },
  },

  {
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*", "@/app/*"],
              message: "shared/ must not import from features/ or app/.",
            },
          ],
        },
      ],
    },
  },

  {
    files: ["src/features/auth/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/features/todos/api/*",
                "@/features/todos/hooks/*",
                "@/features/todos/store/*",
                "@/features/todos/queries/*",
                "@/features/todos/schemas/*",
                "@/features/todos/types/*",
                "@/features/todos/components/*",
                "@/features/todos/constants/*",
              ],
              message: "Import from '@/features/todos' (the barrel) instead.",
            },
          ],
        },
      ],
    },
  },

  {
    files: ["src/features/todos/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/features/auth/api/*",
                "@/features/auth/hooks/*",
                "@/features/auth/store/*",
                "@/features/auth/queries/*",
                "@/features/auth/schemas/*",
                "@/features/auth/types/*",
                "@/features/auth/pages/*",
              ],
              message: "Import from '@/features/auth' (the barrel) instead.",
            },
          ],
        },
      ],
    },
  },
]);
