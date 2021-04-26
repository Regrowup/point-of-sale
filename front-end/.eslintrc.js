const path = require('path');
const configPath = path.join(__dirname, './webpack.dev.js');

module.exports = {
  'root': true,
  'parser': 'babel-eslint',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    }
  },
  'plugins': [
    'react',
    'react-hooks',
    'lodash'
  ],
  'extends': [
    'airbnb',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended'
  ],
  'env': {
    'browser': true,
    'node': true,
    'es6': true,
  },
  settings: {
    'import/resolver': {
      webpack: { config: configPath },
    },
  },
  'rules': {
    'react/jsx-filename-extension': ['warn', { 'extensions': ['.js', '.jsx'] }],
    'no-param-reassign': ['error', { 'props': false }],
    'comma-dangle': ['error', {
      'arrays': 'always-multiline',
      'objects': 'always-multiline',
      'functions': 'ignore'
    }],
    'lodash/import-scope': ['error', 'member'],
    'lodash/prefer-constant': ['error', true, true],
    'lodash/prefer-get': 'error',
    'lodash/prefer-lodash-typecheck': 'error',
    'lodash/prefer-noop': 'error',
    'no-undefined': 'error',
    'no-shadow': 'error',
    'no-shadow-restricted-names': 'error',
    'no-unused-expressions': ['error', { 'allowTaggedTemplates': true, 'allowTernary': true }],
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
    'react/no-array-index-key': 'off',
    'object-curly-spacing': 'error',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': ['error', { ignore: ['@'] }],
    'jsx-a11y/label-has-for': ['error', { 'allowChildren': true }],
    'jsx-a11y/label-has-associated-control': ['error', {
      'controlComponents': ['Toggle', 'Select'],
    }],
    'react/sort-comp': ['error', {
      'order': [
        'propTypes',
        'defaultProps',
        'statics',
        'static-methods',
        'instance-variables',
        'lifecycle',
        'instance-methods',
        'everything-else',
        'render',
      ]
    }],
    'react/forbid-prop-types': 'off',
    'quotes': ['error', 'single'],
    'react/destructuring-assignment': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'semi': 'error',
    'arrow-body-style': ['error', 'as-needed'],
    'arrow-parens': ['error', 'as-needed'],
    'quote-props': ['error', 'as-needed'],
    'react/no-unescaped-entities': 'off',
    'no-empty': ['error', { 'allowEmptyCatch': true }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  }
};
