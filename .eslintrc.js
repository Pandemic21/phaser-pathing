module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "func-call-spacing": "error",
        "func-name-matching": "error",
        "func-names": "error",
        "func-style": "error",
        "function-paren-newline": "error",
        "generator-star-spacing": "error",
        "no-bitwise": "error",
        "no-confusing-arrow": ["error", {"allowParens": true}],
        "no-duplicate-imports": "error",
        "space-in-parens": ["error", "never"],
        "no-unused-vars": ["error", { "vars": "all", "args": "none", "ignoreRestSiblings": false }],
        "camelcase": "error"
    }
};
