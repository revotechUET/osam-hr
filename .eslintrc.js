module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly",
    "google": "readonly",
  },
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true,
    },
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "unused-imports",
  ],
  "settings": {
    "react": {
      "version": "detect",
    }
  },
  "rules": {
    "react/display-name": 0,
    "react/prop-types": 0,
    "no-unused-vars": 0,
    "no-empty": "off",
    "unused-imports/no-unused-imports": 1,
  },
  "ignorePatterns": ["node_modules/", "gas", "dist"],
};
