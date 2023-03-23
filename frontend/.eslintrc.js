module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "airbnb", "prettier"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "react/function-component-definition": [
      2,
      { namedComponents: "arrow-function" },
    ],
    "react/prop-types": [0],
    "no-unused-vars": [1],
    camelcase: [0],
  },
};
