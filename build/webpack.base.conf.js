const path = require('path');
let glob = require("glob-all");
const webpack = require('webpack');
let PurgecssPlugin = require("purgecss-webpack-plugin");
const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const env = process.env.NODE_ENV === 'production'
  ? 'production'
  : 'development';

const devtool = env === 'production' ? 'source-map' : 'eval-source-map';

const extractOrInjectStyles = env !== 'production'
  ? 'vue-style-loader'
  : MiniCssExtractPlugin.loader;

// Custom PurgeCSS extractor for Tailwind that allows special characters in
// class names.
//
// https://github.com/FullHuman/purgecss\#extractor
class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
  }
}

module.exports = {
  mode: env,
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    filename: '[name].js',
  },
  devtool,
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'src': path.resolve(__dirname, '../src'),
      'vue$': 'vue/dist/vue.esm.js',
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, '../'),
        exclude: /node_modules/,
      },
      {
        test: /\.s?css$/,
        use: [
          extractOrInjectStyles,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': env,
    }),
    new MiniCssExtractPlugin({
      filename: 'gcard-email-manager.css',
    }),
    new VueLoaderPlugin(),
    new PurgecssPlugin({

      // Specify the locations of any files you want to scan for class names.
      paths: glob.sync([
        path.join(__dirname, "../**/*.html"),
        path.join(__dirname, "../src/**/*.vue"),
        path.join(__dirname, "../src/**/*.js")
      ]),
      extractors: [
        {
          extractor: TailwindExtractor,

          // Specify the file extensions to include when scanning for
          // class names.
          extensions: ["html", "js", "vue"]
        }
      ]
    })
  ],
  stats: {
    children: false,
    modules: false,
  },
};
