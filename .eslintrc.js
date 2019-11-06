module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ['plugin:vue/essential', '@vue/airbnb', '@vue/typescript'],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'class-methods-use-this': 'off',
        'func-names': 'off',
        'import/prefer-default-export': 'off',
        'linebreak-style': 'off',
        'no-named-as-default': 'off',
        'no-param-reassign': 'off',
        'no-unused-expressions': 'off',
        'no-empty-function': 'off',
        indent: ['error', 4],
    },
    parserOptions: {
        parser: '@typescript-eslint/parser',
    },
    overrides: [
        {
            files: [
                '**/__tests__/*.{j,t}s?(x)',
                '**/tests/unit/**/*.spec.{j,t}s?(x)',
            ],
            env: {
                jest: true,
            },
        },
    ],
};
