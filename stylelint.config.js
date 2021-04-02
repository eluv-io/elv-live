module.exports = {
  "extends": "stylelint-config-sass-guidelines",

  plugins: [
    "stylelint-scss",
  ],
  rules: {
    "max-nesting-depth": 4,
    "selector-no-qualifying-type": false,
    "selector-class-pattern": null
  }
};
