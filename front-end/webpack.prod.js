const path = require('path');
const merge = require('webpack-merge');
const Dotenv = require('dotenv-webpack');

const envPath = path.resolve(__dirname, '.env.production');
require('dotenv').config({ path: envPath });

const common = require('./webpack.common.js');

module.exports = merge(common, {
  output: {
    filename: '[name].[contenthash].js',
  },
  mode: 'production',
  plugins: [
    new Dotenv({
      path: envPath,
      defaults: true,
    }),
  ],
  performance: {
    hints: false,
  },
});
