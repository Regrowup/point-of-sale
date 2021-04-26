require('dotenv').config();

const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const Dotenv = require('dotenv-webpack');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  output: {
    filename: '[name].[hash].js',
  },
  mode: 'development',
  devtool: 'inline-source-map',
  cache: true,
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: true,
    clientLogLevel: 'error',
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new Dotenv({
      defaults: true,
    }),
  ],
});
