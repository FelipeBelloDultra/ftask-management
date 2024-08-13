/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('eslint').Linter.Config}  */
module.exports = {
  env: {
    browser: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:import/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "eslint-plugin-react-hooks", "eslint-plugin-react-refresh"],
  root: true,
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "_",
      },
    ],
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "no-type-imports",
        disallowTypeAnnotations: true,
        fixStyle: "separate-type-imports",
      },
    ],
    "sort-imports": [
      "error",
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],
    "import/no-unresolved": "off",
    "import/no-named-as-default-member": "off",
    "import/no-named-as-default": 0,
    "import/order": [
      1,
      {
        pathGroups: [
          {
            pattern: "@/**",
            group: "internal",
            position: "after",
          },
        ],
        groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    "import/newline-after-import": "error",
    "@typescript-eslint/explicit-member-accessibility": "warn",
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {},
    },
  },
};
// extends: [js.configs.recommended, ...tseslint.configs.recommended],
//   files: ["**/*.{ts,tsx}"],
//   ignores: ["dist"],
//   languageOptions: {
//     ecmaVersion: 2020,
//     globals: globals.browser,
//   },
//   plugins: {
//     "react-hooks": reactHooks,
//     "react-refresh": reactRefresh,
//   },
//   rules: {
//     ...reactHooks.configs.recommended.rules,
//     "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
//   },
