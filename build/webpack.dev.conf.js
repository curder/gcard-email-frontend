const merge = require('webpack-merge');
const chokidar = require('chokidar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.conf');

/**
 *
 */
module.exports = merge(baseWebpackConfig, {
  entry: './dev/main.js',
  plugins: [
    // See https://github.com/jantimon/html-webpack-plugin#options
    new HtmlWebpackPlugin({
      title: 'Gcard Send Email Frontend Dev.',
      filename: 'index.html',
      template: './public/index.html',
      inject: true,
    }),
  ],
  optimization: {
    noEmitOnErrors: true,
  },
  // See https://webpack.docschina.org/configuration/dev-server/
  devServer: {
    clientLogLevel: 'error',
    compress: true,
    hot: true,
    hotOnly: true,
    open: true,
    inline: true,
    stats: {
      children: false,
      modules: false,
      chunks: false,
    },
    port: 8080,
    before (app, server) {
      chokidar.watch([
        './**/*.html',
      ]).on('all', function () {
        server.sockWrite(server.sockets, 'content-changed');
      });
    },
  },
});
