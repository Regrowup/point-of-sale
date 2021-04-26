const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: process.env.ASSET_PATH,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      { test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      { test: /\.s?css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      { test: /\.(jpe?g|png|gif|svg|ico)$/,
        use: 'url-loader',
      },
      { test: /\.(woff(2)?|ttf|eot)$/,
        use: 'url-loader',
      },
    ],
  },
  node: { fs: 'empty' },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new HtmlWebpackPlugin({
      alwaysWriteToDisk: true,
      template: path.resolve(__dirname, 'src/index.html'),
    }),
    new HtmlWebpackHarddiskPlugin(),
    new FaviconsWebpackPlugin({
      logo: './src/favicon_logo.png',
      title: 'Point of Sale',
      icons: {
        android: false,
        appleIcon: true,
        appleStartup: true,
        coast: false,
        favicons: true,
        firefox: true,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false,
      },
    }),
    new webpack.HashedModuleIdsPlugin(),
  ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};
