const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  // entry: {
  //   main: path.resolve(__dirname, 'src/index.js'),
  // },
  // output: {
  //   filename: '[name].js', // name will be entry name :- "main" in this case
  //   path: path.join(__dirname, 'dist'),
  //   publicPath: '/',
  // },
  devServer: {
    // host: 'localhost',
    port: 3001,
    historyApiFallback: true,
    open: true,
    // contentBase: './',
    hot: true,
  },
});
