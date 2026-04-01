import { defineConfig, globalIgnores } from "eslint/config";
import { fixupConfigRules } from "@eslint/compat";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores(
    ["**/node_modules", "!node_modules/@jest/*", "lib/*", "lib-old/*", "dist/*", "android/*"],
), {
    extends: fixupConfigRules(compat.extends("eslint:recommended")),

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        ecmaVersion: "latest",
        sourceType: "module",
    },

    rules: {
        // Usar prefixo _ para args intencionalmente ignorados: function foo(_unused) {}
        "no-unused-vars": ["warn", {
            "vars": "all",
            "args": "after-used",
            "argsIgnorePattern": "^_",
            "caughtErrors": "none"
        }],
        "no-useless-escape": "off",
        "no-constant-condition": "error",
        "no-var": "error",
        semi: ["error", "always"],
        "no-implicit-globals": "error",

        "no-use-before-define": ["error", {
            functions: false,
        }],

        "no-duplicate-imports": "error",
        "no-invalid-this": "error",
        "no-shadow": "error",
        "no-useless-assignment": "warn",
        //"import/no-absolute-path": "error",
        //"import/no-self-import": "error",

        // "import/extensions": ["error", "always", {
        //     js: "always",
        // }],
    },
}]);