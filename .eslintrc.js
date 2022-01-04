module.exports = {
  root: true,
  env: {
    node: true
  },
  "extends": [
    "plugin:vue/recommended",
    "eslint:recommended"
  ],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/require-default-prop": "off",
    "vue/attribute-hyphenation": ["error", "never"],
    "quotes": ["error", "double"],
    "indent": ["error", 2],
    "semi": ["error", "never"]
  },
}
